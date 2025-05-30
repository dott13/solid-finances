import { Component, createMemo } from 'solid-js';

interface SavingsChartProps {
  monthlySave: number;
  goalAmount: number;
  goalName: string;
  currency: string;
}

const SavingsChart: Component<SavingsChartProps> = (props) => {
  // number of months to goal (round up)
  const monthsToGoal = Math.ceil(props.goalAmount / props.monthlySave);
  
  // build points: for 0..monthsToGoal, cumulative savings
  const data = createMemo(() =>
    Array.from({ length: monthsToGoal + 1 }, (_, i) => ({
      x: i,
      y: i * props.monthlySave
    }))
  );

  // SVG dimensions - now responsive
  const height = 200;
  const padding = 40;
  
  // scale functions - using viewBox for responsiveness
  const maxY = Math.max(props.goalAmount, ...data().map(d => d.y));
  const viewBoxWidth = 400;
  const scaleX = (x: number) => padding + ((viewBoxWidth - 2 * padding) * x) / monthsToGoal;
  const scaleY = (y: number) => height - padding - ((height - 2 * padding) * y) / maxY;
  
  // polyline points
  const points = data()
    .map(d => `${scaleX(d.x)},${scaleY(d.y)}`)
    .join(' ');
  
  // horizontal guide line at goalAmount
  const guideY = scaleY(props.goalAmount);

  return (
    <div class="bg-white rounded-lg shadow border-2 border-[var(--color-brand-primary)] p-6 w-full">
      <h3 class="text-lg font-semibold text-[var(--color-brand-primary)] mb-2">
        Savings Progress: {props.goalName}
      </h3>
      <p class="text-sm text-[var(--color-brand-dark)] mb-4">
        Projected timeline to reach your goal
      </p>
      <svg 
        viewBox={`0 0 ${viewBoxWidth} ${height}`} 
        class="w-full h-auto"
        style="min-height: 200px;"
      >
        {/* axes */}
        <line
          x1={padding} y1={padding}
          x2={padding} y2={height - padding}
          stroke="var(--color-brand-dark)" stroke-width="2"
        />
        <line
          x1={padding} y1={height - padding}
          x2={viewBoxWidth - padding} y2={height - padding}
          stroke="var(--color-brand-dark)" stroke-width="2"
        />
        
        {/* guide line */}
        <line
          x1={padding} y1={guideY}
          x2={viewBoxWidth - padding} y2={guideY}
          stroke="var(--color-brand-accent)" stroke-dasharray="4 4"
        />
        
        {/* polyline */}
        <polyline
          fill="none"
          stroke="var(--color-brand-primary)"
          stroke-width="3"
          points={points}
        />
        
        {/* labels */}
        <text
          x={padding} y={padding - 5}
          class="text-xs fill-[var(--color-brand-dark)]"
        >
          {props.goalAmount} {props.currency}
        </text>
        <text
          x={viewBoxWidth - padding} y={height - padding + 15}
          class="text-xs fill-[var(--color-brand-dark)]"
          text-anchor="end"
        >
          {monthsToGoal} mo
        </text>
      </svg>
    </div>
  );
};

export default SavingsChart;