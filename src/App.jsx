import { useState } from 'react'
import prizes from './data/prizes.json'

// Ticket format: 2 Myanmar letters + space + 6 Myanmar digits, e.g. "ကက ၁၂၃၄၅၆"
const TICKET_EXAMPLE = 'ကက ၁၂၃၄၅၆'
const TICKET_MAX_LENGTH = TICKET_EXAMPLE.length // 9 characters incl. space
const TICKET_KEY_LENGTH = 8 // same ticket without the space

// Remove spaces so "ကက၁၂၃" and "ကက ၁၂၃" match the same ticket
function toKey(text) {
  return text.replace(/\s/g, '')
}

// Flatten every prize into one list: [{ ticket, key, prize }, ...]
const allTickets = prizes.flatMap((prize) =>
  prize.ticketNumber.map((ticket) => ({ ticket, key: toKey(ticket), prize })),
)

// "10000000" → "၁၀,၀၀၀,၀၀၀ ကျပ်"
function formatAmount(amount) {
  return amount.toLocaleString('en-US-u-nu-mymr') + ' ကျပ်'
}

function App() {
  const [query, setQuery] = useState('')
  const queryKey = toKey(query)

  // Runs on every keystroke → realtime search
  const matches = queryKey
    ? allTickets.filter((item) => item.key.includes(queryKey))
    : []
  const winner = allTickets.find((item) => item.key === queryKey)
  const isComplete = queryKey.length === TICKET_KEY_LENGTH

  function handleChange(event) {
    const value = event.target.value
      // English digits 0-9 → Myanmar digits ၀-၉
      .replace(/[0-9]/g, (digit) => String.fromCharCode(0x1040 + Number(digit)))
      // Keep only Myanmar letters (က-အ), Myanmar digits (၀-၉) and spaces
      .replace(/[^\u1000-\u1021\u1040-\u1049 ]/g, '')
      .slice(0, TICKET_MAX_LENGTH)
    setQuery(value)
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-600 px-4 py-20 text-center text-white">
        <h1 className="text-4xl font-bold sm:text-5xl">Lottery Prize Checker</h1>
        <p className="mt-3 text-indigo-100">
          Type your ticket number, e.g. {TICKET_EXAMPLE}. Results update as you type.
        </p>

        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={TICKET_EXAMPLE}
          aria-label="Ticket number"
          className="mx-auto mt-8 block w-full max-w-md rounded-2xl bg-white px-6 py-4 text-center font-mono text-3xl tracking-widest text-slate-900 shadow-xl outline-none focus:ring-4 focus:ring-yellow-300"
        />

        <div className="mx-auto mt-6 max-w-md">
          {winner && (
            <div className="rounded-2xl bg-yellow-300 p-6 text-slate-900 shadow-lg">
              <p className="text-2xl font-bold">🎉 Congratulations!</p>
              <p className="mt-1">
                Ticket <span className="font-mono font-bold">{winner.ticket}</span> won the{' '}
                <span className="font-bold">{winner.prize.name}</span>
              </p>
              <p className="mt-2 text-3xl font-extrabold">
                {formatAmount(winner.prize.prizeAmount)}
              </p>
            </div>
          )}

          {isComplete && !winner && (
            <div className="rounded-2xl bg-white/15 p-6">
              <p className="text-xl font-semibold">Sorry, no prize this time.</p>
              <p className="mt-1 text-indigo-100">Better luck next draw!</p>
            </div>
          )}

          {queryKey && !isComplete && (
            <div className="rounded-2xl bg-white/15 p-4 text-left">
              {matches.length === 0 ? (
                <p className="text-center text-indigo-100">No winning tickets contain “{query}”.</p>
              ) : (
                <>
                  <p className="mb-2 text-sm text-indigo-100">
                    {matches.length === 1 ? '1 winning ticket contains' : `${matches.length} winning tickets contain`} “{query}”
                  </p>
                  <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
                    {matches.map((item) => (
                      <li
                        key={item.ticket}
                        className="flex justify-between rounded-lg bg-white/10 px-3 py-2"
                      >
                        <span className="font-mono">{item.ticket}</span>
                        <span>{item.prize.name}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Prize list */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Winning Numbers</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {prizes.map((prize) => (
            <div key={prize.name} className="rounded-2xl bg-white p-5 shadow">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">{prize.name}</h3>
                <span className="font-bold text-indigo-600">
                  {formatAmount(prize.prizeAmount)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {prize.ticketNumber.map((ticket) => {
                  const highlighted = queryKey && toKey(ticket).includes(queryKey)
                  return (
                    <span
                      key={ticket}
                      className={
                        'rounded-lg px-3 py-1 font-mono ' +
                        (highlighted ? 'bg-yellow-300 font-bold' : 'bg-slate-100')
                      }
                    >
                      {ticket}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
