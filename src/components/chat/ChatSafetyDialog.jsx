/**
 * Chat Safety Dialog Component
 * Displays safety guidelines before user starts chatting
 */

import { AlertTriangle, Shield, CreditCard, Phone, Flag, X } from "lucide-react";

export default function ChatSafetyDialog({ onAccept, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Chat Safety Guidelines</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <p className="text-gray-600">
            Before you start chatting, please keep these important points in mind:
          </p>

          {/* Safety First */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Safety First</h3>
            </div>
            <ul className="space-y-2 ml-7 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Never share sensitive personal information (bank details, passwords, OTP)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Meet in public places for inspections and exchanges</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Verify the item's condition before making any payment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Bring a friend or family member when meeting strangers</span>
              </li>
            </ul>
          </div>

          {/* Payment Protection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Payment Protection</h3>
            </div>
            <ul className="space-y-2 ml-7 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Avoid advance payments to unknown sellers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span className="font-semibold">Never scan QR codes sent by unknown users</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Use secure payment methods with buyer protection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Get a proper receipt for all transactions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Be cautious of fake payment screenshots</span>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Contact Information</h3>
            </div>
            <ul className="space-y-2 ml-7 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span className="font-semibold">Think carefully before sharing your mobile number</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Use in-app chat as long as possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Block users who harass or spam you</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Never share your home address until absolutely necessary</span>
              </li>
            </ul>
          </div>

          {/* Red Flags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-gray-900">Red Flags to Watch For</h3>
            </div>
            <ul className="space-y-2 ml-7 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Requests for immediate payment or urgency tactics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Prices that seem too good to be true</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Sellers unwilling to meet in person or show the item</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Requests to move conversation off-platform immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Suspicious QR codes or payment links</span>
              </li>
            </ul>
          </div>

          {/* Platform Guidelines */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold text-gray-900">Platform Guidelines</h3>
            </div>
            <ul className="space-y-2 ml-7 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Be respectful and professional in all communications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Report suspicious behavior or scam attempts immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Do not engage in prohibited activities</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Follow all terms of service</span>
              </li>
            </ul>
          </div>

          {/* Agreement Text */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700 text-center">
              By clicking <span className="font-semibold">"I Understand"</span>, you agree to follow these safety guidelines.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2.5 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            I Understand & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
