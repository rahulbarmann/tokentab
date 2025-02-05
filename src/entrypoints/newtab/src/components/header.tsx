// import profile from '../../public/profile.svg';
// import metamaskFox from '../../public/metamask-fox.svg';
// import info from '../../public/info.svg';
import { Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good Morning'
  if (hour >= 12 && hour < 17) return 'Good Afternoon'
  if (hour >= 17 && hour < 22) return 'Good Evening'
  return 'Good Night'
}

export function Header() {
  const [greeting, setGreeting] = useState(getGreeting())
  const [name, setName] = useState('anon')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting())
    }, 60000)

    // Load name from local storage
    const savedName = localStorage.getItem('userName')
    if (savedName) {
      setName(savedName)
    }

    return () => clearInterval(interval)
  }, [])

  const handleNameChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newName = (e.target as HTMLInputElement).value.trim()
      if (newName) {
        setName(newName)
        localStorage.setItem('userName', newName)
      }
      setIsEditing(false)
    }
  }

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-white">
            {greeting},{' '}
            {isEditing ? (
              <input
                type="text"
                defaultValue={name}
                autoFocus
                onKeyDown={handleNameChange}
                onBlur={() => setIsEditing(false)}
                className="bg-transparent outline-none border-b border-gray-500 focus:border-blue-500"
              />
            ) : (
              <span>{name}</span>
            )}
          </h1>
          <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white transition-colors">
            <Pencil size={16} />
          </button>
        </div>
        <p className="text-sm text-gray-400">some heading text comes here</p>
      </div>
      {/* <div className="flex items-center gap-3 ">
        <div className="flex items-center -space-x-5">
          <div className="z-10 size-12 overflow-visible rounded-full">
            <img src={profile} alt="Profile" width={28} height={28} className="size-full object-cover" />
          </div>
          <div className="z-0 flex w-24 gap-2 rounded-full bg-[#232434] py-1.5 pl-7 backdrop-blur">
            <div className="text-sm font-semibold text-white">566T</div>
            <div className="flex size-5 items-center justify-center rounded-full">
              <img src={info} alt="asd" width={15} height={15} />
            </div>
          </div>
        </div>

        <button>
          <img src={metamaskFox} alt="MetaMask" width={160} height={60} />
        </button>
      </div> */}
    </div>
  )
}
