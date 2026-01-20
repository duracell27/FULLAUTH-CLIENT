import { Metadata } from 'next'
import GuideClient from './GuideClient'

export const metadata: Metadata = {
  title: 'Guide - Lendower',
  description: 'Learn how to use Lendower application',
}

export default function GuidePage() {
  return <GuideClient />
}
