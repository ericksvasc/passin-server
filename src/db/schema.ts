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
    id: integer('id').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    eventId: text('event_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  attendees => ({
    pk: primaryKey({ columns: [attendees.eventId, attendees.id] }),
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
    id: serial('id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    attendeeId: integer('attendee_Id').unique().notNull(),
    eventId: text('event_id').notNull(),
  },
  checkIns => ({
    pk: primaryKey({ columns: [checkIns.eventId, checkIns.attendeeId] }),
    eventFk: foreignKey({
      name: 'check_ins_attendeeId_fkey',
      columns: [checkIns.eventId, checkIns.attendeeId],
      foreignColumns: [attendees.eventId, attendees.id],
    })
      .onDelete('restrict')
      .onUpdate('cascade'),
  })
)
