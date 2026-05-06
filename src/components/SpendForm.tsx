'use client'

import { useState, useEffect } from 'react'

interface Tool {
  name: string
  plans: string[]
  monthlyPrice: { [key: string]: number }
}

const TOOLS: Tool[] = [
  {
    name: 'Cursor',
    plans: ['Hobby', 'Pro', 'Business', 'Enterprise'],
    monthlyPrice: { Hobby: 0, Pro: 20, Business: 40, Enterprise: 0 },
  },
  {
    name: 'GitHub Copilot',
    plans: ['Individual', 'Business', 'Enterprise'],
    monthlyPrice: { Individual: 10, Business: 21, Enterprise: 0 },
  },
  {
    name: 'Claude',
    plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API'],
    monthlyPrice: { Free: 0, Pro: 20, Max: 200, Team: 30, Enterprise: 0, API: 0 },
  },
  {
    name: 'ChatGPT',
    plans: ['Plus', 'Team', 'Enterprise', 'API'],
    monthlyPrice: { Plus: 20, Team: 30, Enterprise: 0, API: 0 },
  },
  {
    name: 'Gemini',
    plans: ['Free', 'Pro', 'Ultra', 'API'],
    monthlyPrice: { Free: 0, Pro: 10, Ultra: 20, API: 0 },
  },
]

const USE_CASES = ['Coding', 'Writing', 'Data', 'Research', 'Mixed']

interface FormData {
  tools: Array<{
    name: string
    plan: string
    seats: number
    monthlySpend: number
  }>
  teamSize: string
  useCase: string
}

export default function SpendForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const [formData, setFormData] = useState<FormData>({
    tools: [],
    teamSize: '',
    useCase: '',
  })

  // Load form from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('auditFormData')
    if (saved) {
      setFormData(JSON.parse(saved))
    }
  }, [])

  // Save form to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('auditFormData', JSON.stringify(formData))
  }, [formData])

  const addTool = () => {
    setFormData({
      ...formData,
      tools: [
        ...formData.tools,
        {
          name: TOOLS[0].name,
          plan: TOOLS[0].plans[0],
          seats: 1,
          monthlySpend: 0,
        },
      ],
    })
  }

  const removeTool = (index: number) => {
    setFormData({
      ...formData,
      tools: formData.tools.filter((_, i) => i !== index),
    })
  }

  const updateTool = (index: number, field: string, value: any) => {
    const updated = [...formData.tools]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, tools: updated })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">What AI tools do you use?</h2>

      {/* Tools Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Your Tools</h3>
        {formData.tools.length === 0 ? (
          <p className="text-gray-500 mb-4">No tools added yet</p>
        ) : (
          formData.tools.map((tool, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tool</label>
                  <select
                    value={tool.name}
                    onChange={(e) => {
                      const toolDef = TOOLS.find((t) => t.name === e.target.value)
                      if (toolDef) {
                        updateTool(index, 'name', toolDef.name)
                        updateTool(index, 'plan', toolDef.plans[0])
                      }
                    }}
                    className="w-full p-2 border rounded"
                  >
                    {TOOLS.map((t) => (
                      <option key={t.name} value={t.name}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Plan</label>
                  <select
                    value={tool.plan}
                    onChange={(e) => updateTool(index, 'plan', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {TOOLS.find((t) => t.name === tool.name)?.plans.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Seats</label>
                  <input
                    type="number"
                    min="1"
                    value={tool.seats}
                    onChange={(e) => updateTool(index, 'seats', parseInt(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Spend ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={tool.monthlySpend}
                    onChange={(e) => updateTool(index, 'monthlySpend', parseFloat(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeTool(index)}
                className="text-red-600 text-sm font-medium hover:underline"
              >
                Remove tool
              </button>
            </div>
          ))
        )}

        <button
          type="button"
          onClick={addTool}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Tool
        </button>
      </div>

      {/* Team and Use Case */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Team Size</label>
          <input
            type="number"
            min="1"
            value={formData.teamSize}
            onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="e.g., 5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Primary Use Case</label>
          <select
            value={formData.useCase}
            onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select...</option>
            {USE_CASES.map((uc) => (
              <option key={uc} value={uc}>
                {uc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
      >
        Get My Audit
      </button>
    </form>
  )
}