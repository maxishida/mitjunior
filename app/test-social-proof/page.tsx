import React from 'react'
import { SocialProof } from '@/components/landing/SocialProof'

export default function TestSocialProofPage() {
  return (
    <div className="bg-[#0F1419] text-white min-h-screen">
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold text-center mb-8">Teste do Componente SocialProof</h1>

        <SocialProof autoPlay={true} autoPlayInterval={3000} />
      </div>
    </div>
  )
}