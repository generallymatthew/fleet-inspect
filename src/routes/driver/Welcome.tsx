import { useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'

export function Welcome() {
  const navigate = useNavigate()

  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-bold">Fleet Inspect</h1>
        <p className="text-ink-dim">Daily vehicle inspection, made quick.</p>
      </div>
      <BigButton variant="accent" onClick={() => navigate('/vehicle')}>
        Start Inspection
      </BigButton>
    </Screen>
  )
}
