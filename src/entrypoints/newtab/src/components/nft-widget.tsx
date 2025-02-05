/* eslint-disable unicorn/no-unused-properties */

import { Card } from '@/entrypoints/newtab/src/components/ui/card'
import type { NFT } from '@/entrypoints/newtab/src/types/dashboard'
import { CheckCircle } from 'lucide-react'
import nftTemp from '@/assets/nft-temp.svg'
import brightEth from '@/assets/eth-bright.svg'

const nftOfTheDay: NFT = {
  title: 'Zo World Founder',
  creator: 'Zo World',
  image: '/nft-image.jpg',
  price: '2.10 ETH',
  endTime: '10H 24M 05S',
  verified: true,
}

export function NFTWidget() {
  return (
    <Card className="rounded-xl border-0 bg-gray-900/50 p-4">
      <div className="flex justify-center">
        <h3 className="mb-3 font-semibold text-white">NFT of the day</h3>
      </div>
      <div className="space-y-4">
        <img src={nftTemp} alt={nftOfTheDay.title} width={300} height={300} className="w-full rounded-lg" />
        <div className="p-2">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="font-semibold text-white">{nftOfTheDay.title}</h4>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>{nftOfTheDay.creator}</span>
            {nftOfTheDay.verified && <CheckCircle className="size-4 text-blue-500" />}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-gray-400">Current Bid</div>
              <div className="flex font-semibold text-white">
                <div className="size-6">
                  <img src={brightEth} alt="eth" width={5} height={5} className="w-full rounded-lg pr-3" />
                </div>

                <div>{nftOfTheDay.price}</div>
              </div>
            </div>
            <div>
              <div className="text-gray-400">Ends In</div>
              <div className="rounded-2xl bg-[#4E4BDE] px-2 py-1 text-sm text-white">{nftOfTheDay.endTime}</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
