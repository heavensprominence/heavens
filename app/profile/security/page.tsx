"use client"

import { useState } from "react"
import { Switch } from "@headlessui/react"
import { Dialog } from "@headlessui/react"

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

const SecurityRecommendations = () => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-medium text-gray-900">Security Recommendations</h3>
      <p className="mt-2 text-sm text-gray-500">
        We recommend enabling Two-Factor Authentication (2FA) to enhance your account security. While not required, it
        provides an extra layer of protection against unauthorized access.
      </p>
    </div>
  )
}

const SecurityLevelIndicator = ({ is2FAEnabled }: { is2FAEnabled: boolean }) => {
  let level = "Low"
  let color = "red"

  if (is2FAEnabled) {
    level = "High"
    color = "green"
  } else {
    level = "Medium"
    color = "yellow"
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900">Security Level</h3>
      <div className="flex items-center mt-2">
        <div className={`w-3 h-3 rounded-full bg-${color}-500 mr-2`}></div>
        <p className="text-sm text-gray-500">
          Current Protection Level: <span className="font-semibold">{level}</span>
        </p>
      </div>
    </div>
  )
}

const OptOutConfirmationDialog = ({
  open,
  setOpen,
  onConfirm,
}: { open: boolean; setOpen: (open: boolean) => void; onConfirm: () => void }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded bg-white p-6">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Disable Two-Factor Authentication?
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Disabling 2FA will make your account less secure. We strongly recommend keeping it enabled. Are you sure
              you want to proceed?
            </p>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-md bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
              onClick={onConfirm}
            >
              Disable 2FA
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default function SecurityPage() {
  const [enabled, setEnabled] = useState(false)
  const [optOutOpen, setOptOutOpen] = useState(false)

  const handleToggle = () => {
    if (enabled) {
      setOptOutOpen(true)
    } else {
      setEnabled(true)
    }
  }

  const handleConfirmDisable = () => {
    setEnabled(false)
    setOptOutOpen(false)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Security Dashboard</h1>

      <div className="mt-4">
        <h2 className="text-lg font-medium text-gray-900">2FA Status</h2>
        <p className="mt-1 text-sm text-gray-500">
          {enabled ? "Optional - Currently Enabled" : "Optional - Currently Disabled"}
        </p>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
          <Switch
            checked={enabled}
            onChange={handleToggle}
            className={classNames(
              enabled ? "bg-green-600" : "bg-gray-200",
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            )}
          >
            <span className="sr-only">Enable notifications</span>
            <span
              className={classNames(
                enabled ? "translate-x-6" : "translate-x-1",
                "pointer-events-none relative inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              )}
            >
              <span className="absolute inset-0 flex items-center justify-center h-full w-full transition-opacity">
                <span
                  className="h-3 w-3 rounded-full bg-gray-400 opacity-0 transition-opacity ease-in-out duration-200"
                  aria-hidden="true"
                />
              </span>
            </span>
          </Switch>
        </div>
      </div>

      <SecurityLevelIndicator is2FAEnabled={enabled} />
      <SecurityRecommendations />
      <OptOutConfirmationDialog open={optOutOpen} setOpen={setOptOutOpen} onConfirm={handleConfirmDisable} />
    </div>
  )
}
