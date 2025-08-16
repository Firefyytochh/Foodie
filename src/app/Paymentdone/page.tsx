import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function PaymentConfirmation() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-12 text-center bg-white shadow-lg rounded-3xl">
        {/* Payment Done Title */}
        <h1 className="text-4xl font-serif italic text-gray-900 mb-8">Payment Done</h1>

        {/* Orange Checkmark Circle */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-black stroke-[3]" />
          </div>
        </div>

        {/* Thank You Message */}
        <h2 className="text-3xl font-serif italic text-gray-900 mb-4">Thank For Your Order</h2>

        {/* Enjoy Message */}
        <p className="text-xl text-gray-700 font-medium">Enjoy your meal</p>
      </Card>
    </div>
  )
}
