import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className="bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                Ready to start your artistic journey?
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Join our community today and showcase your creativity to the world.
              </p>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
  )
}
