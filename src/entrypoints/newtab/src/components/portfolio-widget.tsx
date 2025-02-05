import { Button } from '@/entrypoints/newtab/src/components/ui/button'
import { Card } from '@/entrypoints/newtab/src/components/ui/card'
// import { RefreshCw } from "lucide-react";

export function PortfolioWidget() {
  return (
    <Card className="mb-4 rounded-xl border-0 bg-[#141331] bg-[url('/union.svg')] bg-no-repeat p-6">
      <div className="text-center">
        <h3 className="mb-4 !text-gray-400">My Portfolio</h3>
        <div className="mb-2 text-4xl font-bold text-white">$4,356.07</div>
        <p className="mb-4 text-sm text-gray-400">7 Nov 2022 At 11:00 Pm</p>
        <Button className="w-24 rounded-xl bg-[#4E4BDE] hover:bg-[#6d6beb]">
          {/* <RefreshCw className="w-4 h-4 mr-2" /> */}
          Refresh
        </Button>
      </div>
    </Card>
  )
}
