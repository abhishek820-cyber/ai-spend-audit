'use client'

import { useState, useEffect, useRef } from 'react'

interface Tool {
  name: string
  category: string
  plans: string[]
}

const TOOLS: Tool[] = [
  // Coding assistants
  { name: 'Cursor', category: 'Coding', plans: ['Hobby', 'Pro', 'Business', 'Enterprise'] },
  { name: 'GitHub Copilot', category: 'Coding', plans: ['Individual', 'Business', 'Enterprise'] },
  { name: 'Windsurf', category: 'Coding', plans: ['Free', 'Pro', 'Teams'] },
  { name: 'Tabnine', category: 'Coding', plans: ['Starter', 'Pro', 'Enterprise'] },
  { name: 'Codeium', category: 'Coding', plans: ['Free', 'Teams', 'Enterprise'] },
  { name: 'Replit', category: 'Coding', plans: ['Free', 'Core', 'Teams'] },
  { name: 'Amazon CodeWhisperer', category: 'Coding', plans: ['Individual', 'Professional'] },
  { name: 'Sourcegraph Cody', category: 'Coding', plans: ['Free', 'Pro', 'Enterprise'] },

  // LLMs / Chat
  { name: 'Claude', category: 'LLM', plans: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API'] },
  { name: 'ChatGPT', category: 'LLM', plans: ['Free', 'Plus', 'Team', 'Enterprise', 'API'] },
  { name: 'Gemini', category: 'LLM', plans: ['Free', 'Pro', 'Ultra', 'API'] },
  { name: 'Grok', category: 'LLM', plans: ['Free', 'Premium', 'Premium+'] },
  { name: 'Mistral', category: 'LLM', plans: ['Free', 'Pro', 'API'] },
  { name: 'Perplexity', category: 'LLM', plans: ['Free', 'Pro'] },
  { name: 'Cohere', category: 'LLM', plans: ['Trial', 'Production', 'Enterprise'] },

  // Image generation
  { name: 'Midjourney', category: 'Image', plans: ['Basic', 'Standard', 'Pro', 'Mega'] },
  { name: 'DALL-E', category: 'Image', plans: ['API'] },
  { name: 'Stable Diffusion', category: 'Image', plans: ['Free', 'Pro', 'Enterprise'] },
  { name: 'Adobe Firefly', category: 'Image', plans: ['Free', 'Premium', 'Business'] },
  { name: 'Runway', category: 'Image', plans: ['Free', 'Standard', 'Pro', 'Unlimited'] },

  // Writing / Productivity
  { name: 'Notion AI', category: 'Writing', plans: ['Free', 'Plus', 'Business'] },
  { name: 'Grammarly', category: 'Writing', plans: ['Free', 'Premium', 'Business'] },
  { name: 'Jasper', category: 'Writing', plans: ['Creator', 'Pro', 'Business'] },
  { name: 'Copy.ai', category: 'Writing', plans: ['Free', 'Pro', 'Team', 'Enterprise'] },
  { name: 'Writesonic', category: 'Writing', plans: ['Free', 'Individual', 'Teams', 'Enterprise'] },

  // Data / Research
  { name: 'Pinecone', category: 'Data', plans: ['Free', 'Standard', 'Enterprise'] },
  { name: 'Weaviate', category: 'Data', plans: ['Sandbox', 'Standard', 'Enterprise'] },
  { name: 'Langchain', category: 'Data', plans: ['Free', 'Plus', 'Enterprise'] },

  // APIs
  { name: 'OpenAI API', category: 'API', plans: ['Pay-as-you-go', 'Committed'] },
  { name: 'Anthropic API', category: 'API', plans: ['Pay-as-you-go', 'Committed'] },
  { name: 'Google AI API', category: 'API', plans: ['Free', 'Pay-as-you-go'] },
  { name: 'Azure OpenAI', category: 'API', plans: ['Pay-as-you-go', 'Committed'] },
  { name: 'AWS Bedrock', category: 'API', plans: ['Pay-as-you-go'] },
  { name: 'Hugging Face', category: 'API', plans: ['Free', 'Pro', 'Enterprise'] },

  // Other
  { name: 'v0', category: 'Other', plans: ['Free', 'Premium', 'Enterprise'] },
  { name: 'Bolt.new', category: 'Other', plans: ['Free', 'Pro'] },
  { name: 'ElevenLabs', category: 'Other', plans: ['Free', 'Starter', 'Creator', 'Pro'] },
  { name: 'Other', category: 'Other', plans: ['Custom'] },
]

const USE_CASES = ['Coding', 'Writing', 'Data', 'Research', 'Mixed']

interface ToolEntry {
  name: string
  plan: string
  seats: number
  monthlySpend: number
  customName?: string
}

interface FormData {
  tools: ToolEntry[]
  teamSize: string
  useCase: string
}

// Searchable tool selector component
function ToolSelector({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const [search, setSearch] = useState(value)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSearch(value)
  }, [value])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch(value) // reset to current value if closed without selecting
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [value])

  const filtered = TOOLS.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  // Group by category
  const grouped = filtered.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = []
    acc[tool.category].push(tool)
    return acc
  }, {} as Record<string, Tool[]>)

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-lg text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          placeholder="Search AI tools..."
        />
      </div>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {Object.keys(grouped).length === 0 ? (
            <div className="p-4 text-center text-body-sm text-on-surface-variant">
              No tools found. Select "Other" for custom tools.
            </div>
          ) : (
            Object.entries(grouped).map(([category, tools]) => (
              <div key={category}>
                <div className="px-4 py-2 bg-surface-container-low border-b border-outline-variant">
                  <span className="text-label-md text-on-surface-variant uppercase tracking-wider">{category}</span>
                </div>
                {tools.map((tool) => (
                  <button
                    key={tool.name}
                    type="button"
                    onClick={() => {
                      onChange(tool.name)
                      setSearch(tool.name)
                      setOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2.5 text-body-sm hover:bg-surface-container transition-colors flex items-center justify-between ${
                      value === tool.name ? 'bg-surface-container text-primary font-medium' : 'text-on-surface'
                    }`}
                  >
                    <span>{tool.name}</span>
                    {value === tool.name && (
                      <span className="material-symbols-outlined text-[18px] text-primary">check</span>
                    )}
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function SpendForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const [formData, setFormData] = useState<FormData>({
    tools: [],
    teamSize: '',
    useCase: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('auditFormData')
    if (saved) {
      try {
        setFormData(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('auditFormData', JSON.stringify(formData))
  }, [formData])

  const addTool = () => {
    setFormData((prev) => ({
      ...prev,
      tools: [...prev.tools, { name: TOOLS[0].name, plan: TOOLS[0].plans[0], seats: 1, monthlySpend: 0 }],
    }))
  }

  const removeTool = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }))
  }

  const updateTool = (index: number, updates: Partial<ToolEntry>) => {
    setFormData((prev) => ({
      ...prev,
      tools: prev.tools.map((tool, i) => (i === index ? { ...tool, ...updates } : tool)),
    }))
  }

  const handleToolNameChange = (index: number, name: string) => {
    const toolDef = TOOLS.find((t) => t.name === name)
    updateTool(index, {
      name,
      plan: toolDef ? toolDef.plans[0] : 'Custom',
    })
  }

  const [errors, setErrors] = useState<string[]>([])

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  const newErrors: string[] = []

  if (formData.tools.length === 0) {
    newErrors.push('Add at least one AI tool to get your audit.')
  }

  formData.tools.forEach((tool, i) => {
    if (!tool.monthlySpend || tool.monthlySpend <= 0) {
      newErrors.push(`Tool ${i + 1} (${tool.name}): please enter a monthly spend amount.`)
    }
    if (!tool.seats || tool.seats < 1) {
      newErrors.push(`Tool ${i + 1} (${tool.name}): seats must be at least 1.`)
    }
  })

  if (!formData.teamSize || parseInt(formData.teamSize) < 1) {
    newErrors.push('Please enter your team size.')
  }

  if (!formData.useCase) {
    newErrors.push('Please select a primary use case.')
  }

  if (newErrors.length > 0) {
    setErrors(newErrors)
    return
  }

  setErrors([])
  const processedTools = formData.tools.map((tool) => ({
    ...tool,
    name: tool.name === 'Other' && tool.customName ? tool.customName : tool.name,
  }))
  onSubmit({ ...formData, tools: processedTools })
}

  const inputClass = "w-full px-4 py-2.5 border border-outline-variant rounded-lg text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
  const selectClass = "w-full px-4 py-2.5 border border-outline-variant rounded-lg text-body-md text-on-surface bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer pr-10"
  const labelClass = "block text-label-md text-on-surface-variant uppercase tracking-wider mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-stack-md">
      <div>
        {formData.tools.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-outline-variant rounded-xl mb-4">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">add_circle</span>
            <p className="text-body-md text-on-surface-variant">No tools added yet</p>
            <p className="text-body-sm text-outline">Click below to add your first AI tool</p>
          </div>
        ) : (
          <div className="space-y-stack-sm mb-4">
            {formData.tools.map((tool, index) => (
              <div key={index} className="p-stack-md border border-outline-variant rounded-xl bg-surface-container-low">
                <div className="grid grid-cols-2 gap-4 mb-4">

                  {/* Searchable tool selector */}
                  <div>
                    <label className={labelClass}>Tool</label>
                    <ToolSelector
                      value={tool.name}
                      onChange={(name) => handleToolNameChange(index, name)}
                    />
                    {tool.name === 'Other' && (
                      <input
                        type="text"
                        value={tool.customName || ''}
                        onChange={(e) => updateTool(index, { customName: e.target.value })}
                        className={`${inputClass} mt-2`}
                        placeholder="Enter tool name..."
                      />
                    )}
                  </div>

                  {/* Plan selector */}
                  <div>
                    <label className={labelClass}>Plan</label>
                    <div className="relative">
                      <select
                        value={tool.plan}
                        onChange={(e) => updateTool(index, { plan: e.target.value })}
                        className={selectClass}
                      >
                        {(TOOLS.find((t) => t.name === tool.name)?.plans || ['Custom']).map((plan) => (
                          <option key={plan} value={plan}>{plan}</option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">expand_more</span>
                    </div>
                  </div>

                  {/* Seats */}
                  <div>
                    <label className={labelClass}>Seats / Licenses</label>
                    <input
                      type="number"
                      min="1"
                      value={tool.seats}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        updateTool(index, { seats: isNaN(val) || val < 1 ? 1 : val })
                      }}
                      className={inputClass}
                    />
                    <p className="text-label-md text-on-surface-variant mt-1">Number of users/licenses</p>
                  </div>

                  {/* Monthly Spend */}
                  <div>
                    <label className={labelClass}>Monthly Spend ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={tool.monthlySpend === 0 ? '' : tool.monthlySpend}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value)
                          updateTool(index, { monthlySpend: isNaN(val) ? 0 : val })
                        }}
                        className={`${inputClass} pl-8`}
                        placeholder="0.00"
                      />
                    </div>
                    <p className="text-label-md text-on-surface-variant mt-1">Total monthly cost</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeTool(index)}
                  className="flex items-center gap-1 text-error text-body-sm font-medium hover:opacity-80 transition-opacity"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                  Remove tool
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addTool}
          className="flex items-center gap-2 px-4 py-2.5 border border-primary text-primary rounded-lg text-body-sm font-medium hover:bg-primary hover:text-on-primary transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Tool
        </button>
      </div>

      {/* Team and Use Case */}
      <div className="grid grid-cols-2 gap-4 pt-stack-sm border-t border-outline-variant">
        <div>
          <label className={labelClass}>Team Size</label>
          <input
            type="number"
            min="1"
            value={formData.teamSize}
            onChange={(e) => setFormData((prev) => ({ ...prev, teamSize: e.target.value }))}
            className={inputClass}
            placeholder="e.g., 20"
          />
          <p className="text-label-md text-on-surface-variant mt-1">Total number of people</p>
        </div>

        <div>
          <label className={labelClass}>Primary Use Case</label>
          <div className="relative">
            <select
              value={formData.useCase}
              onChange={(e) => setFormData((prev) => ({ ...prev, useCase: e.target.value }))}
              className={selectClass}
            >
              <option value="">Select...</option>
              {USE_CASES.map((uc) => (
                <option key={uc} value={uc}>{uc}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">expand_more</span>
          </div>
        </div>
      </div>
{errors.length > 0 && (
  <div className="p-stack-sm bg-error-container rounded-xl border border-error/20">
    <div className="flex items-center gap-2 mb-2">
      <span className="material-symbols-outlined text-error text-[18px]">error</span>
      <p className="text-body-sm font-medium text-on-error-container">
        Please fix the following before continuing:
      </p>
    </div>
    <ul className="space-y-1 pl-6">
      {errors.map((err, i) => (
        <li key={i} className="text-body-sm text-on-error-container list-disc">{err}</li>
      ))}
    </ul>
  </div>
)}
      <button
        type="submit"
        disabled={formData.tools.length === 0}
        className="w-full px-6 py-3.5 bg-primary text-on-primary font-medium rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined text-[20px]">search</span>
        Get My Audit
      </button>
    </form>
  )
}