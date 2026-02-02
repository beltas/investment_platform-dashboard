import type { AssetClassSummary, BentoCardConfig } from '../../types/portfolio'
import type { OrderPrefill } from '../../types/orders'
import { AssetCard } from './AssetCard'

interface BentoGridProps {
  assetClasses: AssetClassSummary[]
  cardConfig: BentoCardConfig[]
  onCreateOrder?: (prefill: OrderPrefill) => void
}

export function BentoGrid({ assetClasses, cardConfig, onCreateOrder }: BentoGridProps) {
  // Sort asset classes by the order specified in cardConfig
  const sortedAssetClasses = [...assetClasses].sort((a, b) => {
    const configA = cardConfig.find((c) => c.assetClass === a.assetClass)
    const configB = cardConfig.find((c) => c.assetClass === b.assetClass)
    return (configA?.order || 99) - (configB?.order || 99)
  })

  return (
    <div className="grid grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]">
      {sortedAssetClasses.map((assetClass, index) => {
        const config = cardConfig.find((c) => c.assetClass === assetClass.assetClass)
        return (
          <AssetCard
            key={assetClass.assetClass}
            assetClass={assetClass}
            size={config?.size || 'default'}
            delay={index}
            onCreateOrder={onCreateOrder}
          />
        )
      })}
    </div>
  )
}
