// import { faker } from '@faker-js/faker'
// import { db } from '.'
// import { attendees, events } from './schema'
// import dayjs from 'dayjs'

// async function seed() {
//   db.delete(events)

//   const eventId = 'hr0e68xev2zkbuh71mai0szz'

//   await db
//     .insert(events)
//     .values({
//       id: eventId,
//       title: 'Unite Summit',
//       details: 'Um evento para apaixonados por códigos',
//       slug: 'unite-sumiit',
//       maximumAttendees: 100,
//     })
//     .returning()

//   const attendeesToInsert = []

//   const attendeess = Array.from({ length: 205 }).map(() => {
//     return {
//       id: faker.number.int({ min: 10000, max: 20000 }),
//       name: faker.person.fullName(),
//       email: faker.internet.email(),
//       createAt: faker.date.recent({ days: 30 }).toISOString(),
//       checkedInAt: faker.date.recent({ days: 7 }).toISOString(),
//     }
//   })

//   await Promise.all(
//     attendeess.map(data => {
//       return db.insert(attendees).values({ data })
//     })
//   )
// }
// seed().then(() => {
//   console.log('database seeded!')
// })

///

import { client, db } from '.' // Importa a instância de conexão com o banco via Drizzle
import { attendees, checkIns, eventManagers, events, managers } from './schema' // Importa suas tabelas definidas
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'

// Definir o tipo de attendeeData
interface AttendeeData {
  id: number
  name: string
  email: string
  eventId: string
  createdAt: Date
}

// Definir o tipo de checkInData
interface CheckInData {
  createdAt: Date
}

// Tipar a variável attendeesToInsert corretamente
const attendeesToInsert: {
  attendeeData: AttendeeData
  checkInData?: CheckInData
}[] = []

const eventId = 'hr0e68xev2zkbuh71mai0szz'
const eventId2 = 'j8u7tfdgak2h6fhnqjh9pgfo'
const eventId3 = 'rddl969wbsvfsyhxtv7jfn34'
const eventId4 = 'b0j0959p3hwsmvq1kazusdhq'
const eventId5 = 'e78gejgtarz1ob2n09ok688j'

for (let i = 0; i < 120; i++) {
  const attendeeId = 10000 + i
  const attendeeData: AttendeeData = {
    id: attendeeId,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    eventId,
    createdAt: faker.date.recent({
      days: 30,
      refDate: dayjs().subtract(8, 'days').toDate(),
    }),
  }

  const checkInData: CheckInData | undefined = faker.helpers.arrayElement([
    undefined,
    {
      createdAt: faker.date.recent({ days: 7 }),
    },
  ])

  attendeesToInsert.push({ attendeeData, checkInData })
}

async function seed() {
  await db
    .insert(events)
    .values({
      id: eventId,
      title: 'Unite Summit',
      details: 'Um evento para apaixonados por códigos',
      slug: 'unite-sumiit',
      maximumAttendees: 120,
    })
    .returning()

  const [{ id: managerId }] = await db
    .insert(managers)
    .values({
      name: 'Erick Souza Vasconcelos',
      email: 'ericksvasc@gmail.com',
      phone: '31991401719',
      role: 'manager',
    })
    .returning()

  await db.insert(eventManagers).values({
    eventId,
    managerId,
  })

  for (const { attendeeData, checkInData } of attendeesToInsert) {
    // Insere o participante
    await db.insert(attendees).values(attendeeData)

    // Se existir check-in, insere o check-in relacionado
    if (checkInData) {
      await db.insert(checkIns).values({
        ...checkInData,
        attendeeId: attendeeData.id,
        eventId: attendeeData.eventId, // Relaciona o check-in com o participante
      })
    }
  }
}

seed().then(() => {
  console.log('Database seeded!')
  client.end() // Encerra a conexão
})
