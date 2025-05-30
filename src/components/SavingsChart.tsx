import { Component, createMemo } from 'solid-js';

interface SavingsChartProps {
  monthlySave: number;
  goalAmount: number;
  goalName: string;
  currency: string;
}

const SavingsChart: Component<SavingsChartProps> = (props) => {
  // compute months to goal
  const monthsToGoal = createMemo(() =>
    props.monthlySave > 0
      ? Math.ceil(props.goalAmount / props.monthlySave)
      : 0
  );

  // build cumulative savings data
  const data = createMemo(() =>
    Array.from({ length: monthsToGoal() + 1 }, (_, i) => ({
      x: i,
      y: i * props.monthlySave
    }))
  );

  // SVG settings
  const height = 200;
  const padding = 40;
  const viewBoxWidth = 400;

  // compute max Y for scaling
  const maxY = createMemo(() =>
    Math.max(props.goalAmount, ...data().map(d => d.y))
  );

  // scale functions
  const scaleX = (x: number) =>
    padding + ((viewBoxWidth - 2 * padding) * x) / monthsToGoal();
  const scaleY = (y: number) =>
    height - padding - ((height - 2 * padding) * y) / maxY();

  // build polyline points string
  const points = createMemo(() =>
    data().map(d => `${scaleX(d.x)},${scaleY(d.y)}`).join(' ')
  );

  // guide line Y position
  const guideY = createMemo(() => scaleY(props.goalAmount));

  return (
    <div
      class="
        bg-[var(--color-card-bg)] dark:bg-[var(--color-card-bg)]
        border-2 border-[var(--color-border)]
        rounded-lg shadow p-6 w-full
      "
    >
      <h3
        class="
          text-lg font-semibold mb-2
          text-[var(--color-brand-primary)] dark:text-[var(--color-brand-accent)]
        "
      >
        Savings Progress: {props.goalName}
      </h3>
      <p
        class="
          text-sm mb-4
          text-[var(--color-text-secondary)] dark:text-[var(--color-text-primary)]
        "
      >
        Projected timeline to reach your goal
      </p>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${height}`}
        class="w-full h-auto"
        style="min-height:200px;"
      >
        {/* Y axis */}
        <line
          x1={padding} y1={padding}
          x2={padding} y2={height - padding}
          stroke="var(--color-border)" stroke-width="2"
        />
        {/* X axis */}
        <line
          x1={padding} y1={height - padding}
          x2={viewBoxWidth - padding} y2={height - padding}
          stroke="var(--color-border)" stroke-width="2"
        />
        {/* guide line */}
        <line
          x1={padding} y1={guideY()}
          x2={viewBoxWidth - padding} y2={guideY()}
          stroke="var(--color-brand-accent)" stroke-dasharray="4 4"
        />
        {/* savings polyline */}
        <polyline
          fill="none"
          stroke="var(--color-brand-primary)"
          stroke-width="3"
          points={points()}
        />
        {/* goal amount label */}
        <text
          x={padding} y={padding - 5}
          class="text-xs fill-[var(--color-text-secondary)]"
        >
          {props.goalAmount} {props.currency}
        </text>
        {/* months label */}
        <text
          x={viewBoxWidth - padding} y={height - padding + 15}
          class="text-xs fill-[var(--color-text-secondary)]"
          text-anchor="end"
        >
          {monthsToGoal()} mo
        </text>
        {/* X-axis tick labels */}
        {data().map(d => (
          <text
            x={scaleX(d.x)} y={height - padding + 30}
            class="text-xs fill-[var(--color-text-secondary)]"
            text-anchor="middle"
          >
            {d.x}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default SavingsChart;
