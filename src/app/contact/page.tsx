import { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
  title: 'Contact - Lendower',
  description: 'Get in touch with Lendower team',
}

export default function ContactPage() {
  return <ContactClient />
}
