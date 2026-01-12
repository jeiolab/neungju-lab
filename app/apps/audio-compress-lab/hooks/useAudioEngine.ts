import { useRef, useState, useEffect, useCallback } from 'react';
import { CompressionMode, SoundType } from '../types';

export const useAudioEngine = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef(false);
  const activeOscillators = useRef<any[]>([]);
  const sequencerTimeout = useRef<number | null>(null);

  const [isReady, setIsReady] = useState(false);

  // Initialize Audio Context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new Ctx();
      
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 2048; // Good resolution for visualizer
      analyser.smoothingTimeConstant = 0.85;
      analyserRef.current = analyser;

      const filter = audioContextRef.current.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 22000; // Open by default
      filterRef.current = filter;

      const gain = audioContextRef.current.createGain();
      gain.gain.value = 0.5;
      gainRef.current = gain;

      // Chain: Source (created later) -> Filter -> Analyser -> Gain -> Destination
      filter.connect(analyser);
      analyser.connect(gain);
      gain.connect(audioContextRef.current.destination);
      
      setIsReady(true);
    } else if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
  }, []);

  // Update Filter based on Compression Mode
  const updateCompression = useCallback((mode: CompressionMode) => {
    if (!filterRef.current || !audioContextRef.current) return;
    
    const now = audioContextRef.current.currentTime;
    
    switch (mode) {
      case 'lossless':
        // Full range
        filterRef.current.frequency.setTargetAtTime(22000, now, 0.1);
        filterRef.current.Q.value = 0;
        break;
      case 'mp3':
        // Cutoff around 16kHz (common for 128kbps)
        filterRef.current.frequency.setTargetAtTime(16000, now, 0.1);
        filterRef.current.Q.value = 1; // Slight resonance at cutoff
        break;
      case 'low_quality':
        // Aggressive cutoff (simulating AM radio or low bitrate phone)
        filterRef.current.frequency.setTargetAtTime(3500, now, 0.1);
        filterRef.current.Q.value = 0;
        break;
    }
  }, []);

  // Sound Synthesis Functions
  const playKick = (ctx: AudioContext, time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(filterRef.current!); // Connect to our main filter chain

    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);

    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

    osc.start(time);
    osc.stop(time + 0.5);
    activeOscillators.current.push(osc);
  };

  const playSnare = (ctx: AudioContext, time: number) => {
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(filterRef.current!);

    noiseGain.gain.setValueAtTime(1, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    noise.start(time);
    activeOscillators.current.push(noise);
  };

  const playHiHat = (ctx: AudioContext, time: number) => {
     // Similar to snare but higher frequency and shorter
    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 10000;
    
    const gain = ctx.createGain();
    
    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(filterRef.current!);
    
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
    
    noise.start(time);
    activeOscillators.current.push(noise);
  }

  const playPianoChord = (ctx: AudioContext, time: number, freqs: number[]) => {
    freqs.forEach(f => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      
      osc.connect(gain);
      gain.connect(filterRef.current!);
      
      osc.frequency.setValueAtTime(f, time);
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 1.5);
      
      osc.start(time);
      osc.stop(time + 2);
      activeOscillators.current.push(osc);
    });
  };

  // Sequencer Loop
  const startSequencer = useCallback((soundType: SoundType) => {
    if (!audioContextRef.current) return;
    
    let ctx = audioContextRef.current;
    let lookahead = 25.0; // ms
    let scheduleAheadTime = 0.1; // s
    let nextNoteTime = ctx.currentTime;
    let beat = 0;

    isPlayingRef.current = true;

    const schedule = () => {
      if (!isPlayingRef.current) return;

      while (nextNoteTime < ctx.currentTime + scheduleAheadTime) {
        // Schedule sound based on beat and type
        if (soundType === 'drums' || soundType === 'mix') {
            if (beat % 4 === 0) playKick(ctx, nextNoteTime);
            if (beat % 4 === 2) playSnare(ctx, nextNoteTime);
            playHiHat(ctx, nextNoteTime); // Every beat
            if (beat % 4 === 2) playHiHat(ctx, nextNoteTime + 0.125); // 8th note
        }
        
        if (soundType === 'piano' || soundType === 'mix') {
           // Cmaj7 - Am7 - Fmaj7 - G7 loop
           if (beat === 0) playPianoChord(ctx, nextNoteTime, [261.63, 329.63, 392.00, 493.88]); // Cmaj7
           if (beat === 4) playPianoChord(ctx, nextNoteTime, [220.00, 261.63, 329.63, 392.00]); // Am7
           if (beat === 8) playPianoChord(ctx, nextNoteTime, [174.61, 220.00, 261.63, 329.63]); // Fmaj7
           if (beat === 12) playPianoChord(ctx, nextNoteTime, [196.00, 246.94, 293.66, 349.23]); // G7
        }

        // Advance beat
        let tempo = 120;
        let secondsPerBeat = 60.0 / tempo;
        let noteLength = 0.25; // 16th notes
        
        // Simulating 4/4 16th note grid
        nextNoteTime += secondsPerBeat * noteLength; 
        beat = (beat + 1) % 16;
      }
      
      sequencerTimeout.current = window.setTimeout(schedule, lookahead);
    };

    schedule();

  }, []);

  const stopAudio = useCallback(() => {
    isPlayingRef.current = false;
    if (sequencerTimeout.current) clearTimeout(sequencerTimeout.current);
    activeOscillators.current.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    activeOscillators.current = [];
  }, []);

  return {
    initAudio,
    startSequencer,
    stopAudio,
    updateCompression,
    analyser: analyserRef.current,
    isReady
  };
};
