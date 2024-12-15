import {
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  primaryKey,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const userRoleEnum = pgEnum('user_role', ['manager', 'attendee'])

export const authLinks = pgTable('auth_links', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  code: text('code').notNull().unique(),
  managerId: text('manager_id')
    .references(() => managers.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const managers = pgTable('managers', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  role: userRoleEnum('role').default('attendee'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const events = pgTable('events', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text('title').notNull(),
  details: text('details'),
  slug: text('slug').notNull().unique(),
  maximumAttendees: integer('maximum_attendees'),
})

export const eventManagers = pgTable(
  'event_managers',
  {
    eventId: text('event_id')
      .references(() => events.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    managerId: text('manager_id')
      .references(() => managers.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  manager => ({
    pk: primaryKey({
      columns: [manager.eventId, manager.managerId],
    }),
  })
)

export const attendees = pgTable(
  'attendees',
  {
    id: integer('id').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    eventId: text('event_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  attendees => [
    primaryKey({ columns: [attendees.eventId, attendees.id] }),
    foreignKey({
      name: 'attendees_event_id_fkey',
      columns: [attendees.eventId],
      foreignColumns: [events.id],
    })
      .onDelete('restrict')
      .onUpdate('cascade'),
    uniqueIndex('attendees_event_id_email_key').on(
      attendees.eventId,
      attendees.email
    ),
  ]
)

export const checkIns = pgTable(
  'check_ins',
  {
    id: serial('id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    attendeeId: integer('attendee_Id').notNull(),
    eventId: text('event_id').notNull(),
  },
  checkIns => [
    primaryKey({ columns: [checkIns.eventId, checkIns.attendeeId] }), // Atualização do primaryKey para o formato de objeto
    foreignKey({
      columns: [checkIns.attendeeId, checkIns.eventId], // Atualização do foreignKey para o formato de objeto
      foreignColumns: [attendees.id, attendees.eventId],
      name: 'check_ins_attendeeId_fkey',
    })
      .onDelete('restrict')
      .onUpdate('cascade'),
  ]
)
