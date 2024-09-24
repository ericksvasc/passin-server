import {
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const events = pgTable('events', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId())
    .unique(),
  title: text('title').notNull(),
  details: text('details'),
  slug: text('slug').notNull().unique(),
  maximumAttendees: integer('maximum_attendees'),
})

export const attendees = pgTable(
  'attendees',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    eventId: text('event_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  attendees => ({
    eventFk: foreignKey({
      name: 'attendees_event_id_fkey',
      columns: [attendees.eventId],
      foreignColumns: [events.id],
    })
      .onDelete('restrict')
      .onUpdate('cascade'),
    uniqueEventEmail: uniqueIndex('attendees_event_id_email_key').on(
      attendees.eventId,
      attendees.email
    ),
  })
)

export const checkIns = pgTable(
  'check_ins',
  {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    attendeeId: integer('attendee_Id').unique().notNull(),
  },
  checkIns => ({
    eventFk: foreignKey({
      name: 'check_ins_attendeeId_fkey',
      columns: [checkIns.attendeeId],
      foreignColumns: [attendees.id],
    })
      .onDelete('restrict')
      .onUpdate('cascade'),
  })
)
