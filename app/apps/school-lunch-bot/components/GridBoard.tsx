import React from 'react';
import { CellType, Direction, RobotState } from '../types';
import { Bot, User, BrickWall, Soup } from 'lucide-react';

interface GridBoardProps {
  grid: number[][];
  robot: RobotState;
}

const GridBoard: React.FC<GridBoardProps> = ({ grid, robot }) => {
  const getRotationClass = (dir: Direction) => {
    switch (dir) {
      case Direction.NORTH: return 'rotate-0';
      case Direction.EAST: return 'rotate-90';
      case Direction.SOUTH: return 'rotate-180';
      case Direction.WEST: return '-rotate-90';
      default: return 'rotate-0';
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-inner border-2 border-gray-200 overflow-auto">
      <div 
        className="grid gap-1 mx-auto"
        style={{ 
          gridTemplateColumns: `repeat(${grid[0].length}, minmax(3rem, 1fr))`,
          width: 'fit-content'
        }}
      >
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const isRobotHere = robot.y === rowIndex && robot.x === colIndex;

            return (
              <div 
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-lg border
                  relative transition-all duration-300
                  ${cell === CellType.WALL ? 'bg-slate-700 border-slate-800' : 'bg-slate-50 border-slate-200'}
                  ${cell === CellType.EMPTY ? 'bg-slate-50' : ''}
                  ${cell === CellType.STUDENT ? 'bg-orange-50 border-orange-200' : ''}
                  ${cell === CellType.SERVED ? 'bg-green-50 border-green-200' : ''}
                `}
              >
                {/* Coordinates Label (Subtle) */}
                <span className="absolute top-0.5 left-1 text-[8px] text-gray-400 font-mono">
                  [{rowIndex},{colIndex}]
                </span>

                {/* Content */}
                {cell === CellType.WALL && <BrickWall className="text-slate-500 w-6 h-6 sm:w-8 sm:h-8" />}
                
                {cell === CellType.STUDENT && (
                  <div className="relative animate-pulse">
                     <User className="text-orange-400 w-6 h-6 sm:w-8 sm:h-8" />
                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                  </div>
                )}
                
                {cell === CellType.SERVED && (
                  <div className="flex flex-col items-center">
                    <User className="text-green-500 w-6 h-6 sm:w-8 sm:h-8" />
                    <Soup className="text-yellow-600 w-4 h-4 absolute bottom-0 right-0 bg-white rounded-full p-0.5" />
                  </div>
                )}

                {/* Robot Overlay */}
                {isRobotHere && (
                  <div className={`absolute inset-0 flex items-center justify-center z-10 transition-transform duration-300 ${getRotationClass(robot.direction)}`}>
                    <div className="bg-blue-500 p-2 rounded-full shadow-lg border-2 border-white">
                      <Bot className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default GridBoard;
