import Link from 'next/link'
import Layout from '@/components/Layout'
import EventItem from '@/components/EventItem'
import Pagination from '@/components/Pagination'
import { API_URL, PER_PAGE } from '@/config/index'

export default function EventsPage({ events, page, lastPage }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}

      {events.map(evt => (
        <EventItem key={evt.id} evt={evt.attributes} />
      ))}

      <Pagination page={page} lastPage={lastPage} />
    </Layout>
  )
}

export async function getServerSideProps({ query: { page = 1 } }) {
  // Fetch events
  const eventRes = await fetch(
    `${API_URL}/api/events?populate=*&pagination[page]=${page}&pagination[pageSize]=${PER_PAGE}&sort=date:asc`,
  )
  const events = await eventRes.json()
  const lastPage = events.meta.pagination.pageCount

  return {
    props: { events: events.data, page: +page, lastPage },
  }
}
