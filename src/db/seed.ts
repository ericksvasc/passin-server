import { client, db } from '.'
import {
  attendees,
  authLinks,
  checkIns,
  eventManagers,
  events,
  managers,
} from './schema'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'

const deleteTable = async () => {
  await db.delete(checkIns)
  await db.delete(attendees)
  await db.delete(eventManagers)
  await db.delete(managers)
  await db.delete(events)
  await db.delete(authLinks)
}

interface AttendeeData {
  id: number
  name: string
  email: string
  eventId: string
  createdAt: Date
}

interface CheckInData {
  createdAt: Date
}

// Array of event details with specific attendee counts
const eventsToCreate = [
  {
    title: 'Unite Summit',
    details: 'Um evento para apaixonados por códigos',
    slug: 'unite-summit',
    maximumAttendees: 250,
    targetAttendees: 100,
    managerId: 1,
  },
  {
    title: 'Tech Conference 2024',
    details: 'Conferência anual de tecnologia e inovação',
    slug: 'tech-conference-2024',
    maximumAttendees: 200,
    targetAttendees: 102,
    managerId: 1,
  },
  {
    title: 'Developer Day',
    details: 'Um dia inteiro dedicado ao desenvolvimento de software',
    slug: 'developer-day',
    maximumAttendees: 250,
    targetAttendees: 120,
    managerId: 1,
  },
  {
    title: 'Code Workshop',
    details: 'Workshop prático de programação',
    slug: 'code-workshop',
    maximumAttendees: 50,
    targetAttendees: 25,
    managerId: 1,
  },
  {
    title: 'Innovation Summit',
    details: 'Summit focado em inovação tecnológica',
    slug: 'innovation-summit',
    maximumAttendees: 25,
    targetAttendees: 15,
    managerId: 1,
  },
  // New events for the second manager
  {
    title: 'Data Science Conference',
    details: 'Conferência especializada em Data Science e IA',
    slug: 'data-science-conference',
    maximumAttendees: 250,
    targetAttendees: 105,
    managerId: 2,
  },
  {
    title: 'Cloud Computing Workshop',
    details: 'Workshop sobre arquitetura e deploy em nuvem',
    slug: 'cloud-computing-workshop',
    maximumAttendees: 175,
    targetAttendees: 102,
    managerId: 2,
  },
  {
    title: 'Mobile Dev Meetup',
    details: 'Encontro para desenvolvedores mobile',
    slug: 'mobile-dev-meetup',
    maximumAttendees: 40,
    targetAttendees: 18,
    managerId: 2,
  },
]

// Function to generate attendees for an event
function generateAttendeesForEvent(
  eventId: string,
  startId: number,
  count: number
) {
  const attendeesToInsert: {
    attendeeData: AttendeeData
    checkInData?: CheckInData
  }[] = []

  for (let i = 0; i < count; i++) {
    const attendeeId = startId + i
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

  return attendeesToInsert
}

async function seed() {
  // Clear existing data
  await deleteTable()

  // Create both managers
  const [{ id: managerId1 }] = await db
    .insert(managers)
    .values({
      id: 'h3nxgmngrr6cfh7dgnqehimd',
      name: 'Erick Souza Vasconcelos',
      email: 'ericksvasc@gmail.com',
      phone: '31991401719',
      role: 'manager',
    })
    .returning()

  const [{ id: managerId2 }] = await db
    .insert(managers)
    .values({
      id: 'hcj2f261eaibiodnrpcs9c11',
      name: 'Maria Eduarda Moreira Lima',
      email: 'maria@gmail.com',
      phone: '31994078909',
      role: 'manager',
    })
    .returning()

  // Create events and associate them with their respective managers
  let startId = 10000
  for (const eventData of eventsToCreate) {
    const { title, details, slug, maximumAttendees, managerId } = eventData
    const [{ id: eventId }] = await db
      .insert(events)
      .values({ title, details, slug, maximumAttendees })
      .returning()

    const manager = managerId === 1 ? managerId1 : managerId2
    await db.insert(eventManagers).values({
      eventId,
      managerId: manager,
    })

    // Generate and insert attendees for each event in batch
    const eventAttendees = generateAttendeesForEvent(
      eventId,
      startId,
      eventData.targetAttendees
    )

    // Insert attendee data
    const attendeeDataArray = eventAttendees.map(
      ({ attendeeData }) => attendeeData
    )
    await db.insert(attendees).values(attendeeDataArray)

    // Insert check-in data
    const checkInDataArray = eventAttendees
      .filter(({ checkInData }) => checkInData !== undefined)
      .map(({ checkInData, attendeeData }) => ({
        ...checkInData!,
        attendeeId: attendeeData.id,
        eventId: attendeeData.eventId,
      }))

    if (checkInDataArray.length > 0) {
      await db.insert(checkIns).values(checkInDataArray)
    }

    startId += eventData.targetAttendees
  }
}

seed().then(() => {
  console.log('Database seeded!')
  client.end()
})
