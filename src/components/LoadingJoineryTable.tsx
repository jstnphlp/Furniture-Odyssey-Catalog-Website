interface LoadingJoineryTableProps {
  isFinishing?: boolean
}

export function LoadingJoineryTable({ isFinishing = false }: LoadingJoineryTableProps) {
  const iterationCount = isFinishing ? 1 : 'infinite'
  const fillMode = isFinishing ? 'both' : 'none'

  return (
    <div
      className="relative flex h-40 w-40 items-center justify-center"
      data-testid="loading-joinery-table"
      aria-label="Loading"
      role="status"
    >
      <style>
        {`
          @keyframes joinery-leg-left {
            0%, 12% { transform: translateY(24px); opacity: 0; }
            28%, 72% { transform: translateY(0); opacity: 1; }
            88%, 100% { transform: translateY(24px); opacity: 0; }
          }

          @keyframes joinery-leg-right {
            0%, 20% { transform: translateY(24px); opacity: 0; }
            36%, 72% { transform: translateY(0); opacity: 1; }
            88%, 100% { transform: translateY(24px); opacity: 0; }
          }

          @keyframes joinery-top {
            0%, 32% { opacity: 0.32; transform: translateY(0); }
            44% { opacity: 1; transform: translateY(0); }
            52% { opacity: 1; transform: translateY(-2px); }
            64%, 76% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0.32; transform: translateY(0); }
          }

          @keyframes joinery-shadow {
            0%, 20% { opacity: 0.18; transform: scaleX(0.82); }
            44%, 76% { opacity: 0.28; transform: scaleX(1); }
            100% { opacity: 0.18; transform: scaleX(0.82); }
          }
        `}
      </style>

      <div
        className="absolute bottom-[28px] h-[7px] w-[88px] rounded-full bg-[rgba(44,34,24,0.08)]"
        style={{ animation: `joinery-shadow 2.4s ease-in-out ${iterationCount}`, animationFillMode: fillMode }}
      />

      <div
        className="absolute bottom-[36px] left-[46px] h-[44px] w-[8px] rounded-full bg-[#8F6544]"
        style={{ animation: `joinery-leg-left 2.4s cubic-bezier(0.4,0,0.2,1) ${iterationCount}`, animationFillMode: fillMode }}
      />
      <div
        className="absolute bottom-[36px] right-[46px] h-[44px] w-[8px] rounded-full bg-[#8F6544]"
        style={{ animation: `joinery-leg-right 2.4s cubic-bezier(0.4,0,0.2,1) ${iterationCount}`, animationFillMode: fillMode }}
      />

      <div
        className="absolute bottom-[76px] h-[12px] w-[96px] rounded-[999px] bg-[#A87650] shadow-[0_10px_24px_rgba(78,52,33,0.16)]"
        style={{ animation: `joinery-top 2.4s cubic-bezier(0.4,0,0.2,1) ${iterationCount}`, animationFillMode: fillMode }}
      />
    </div>
  )
}
