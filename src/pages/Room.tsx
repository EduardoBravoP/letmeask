import { FormEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import '../styles/room.scss'

type RoomParams = {
  id: string;
}

export function Room() {
  const params = useParams<RoomParams>()
  const { user } = useAuth()

  const [newQuestion, setNewQuestion] = useState('')

  async function handleCreateNewQuestion(e: FormEvent) {
    e.preventDefault()
    
    if (newQuestion.trim() === '') {
      return
    }

    if (!user) {
      throw new Error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    await database.ref(`rooms/${params.id}/questions`).push(question)
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={params.id} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala react</h1>
          <span>4 perguntas</span>
        </div>

        <form onSubmit={handleCreateNewQuestion}>
          <textarea
            placeholder="O que voce quer perguntar?"
            onChange={e => setNewQuestion(e.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  )
}