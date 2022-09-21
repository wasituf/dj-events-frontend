import Link from 'next/link'
import Image from 'next/image'
import { FaPencilAlt, FaTimes } from 'react-icons/fa'
import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import styles from '@/styles/Event.module.css'

export default function EventPage({ evt, id }) {
  const deleteEvent = e => {
    console.log('delete')
  }

  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${id}`}>
            <a>
              <FaPencilAlt /> Edit Event
            </a>
          </Link>
          <a href='#' className={styles.delete}>
            <FaTimes /> Delete Event
          </a>
        </div>

        <span>
          {new Date(evt.date).toLocaleDateString('en-GB')} at {evt.time}
        </span>

        <h1>{evt.name}</h1>

        {evt.image.data && (
          <div className={styles.image}>
            <Image
              src={evt.image.data.attributes.formats.large.url}
              alt=''
              width={960}
              height={600}
            />
          </div>
        )}

        <h3>Performers:</h3>
        <p>{evt.performers}</p>
        <h3>Description</h3>
        <p>{evt.description}</p>
        <h3>Venue: {evt.venue}</h3>
        <p>{evt.address}</p>

        <Link href='/events'>
          <a className={styles.back}>{'<'} Go Back</a>
        </Link>
      </div>
    </Layout>
  )
}

//

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/events`)
  const events = await res.json()

  const paths = events.data.map(evt => ({
    params: { slug: evt.attributes.slug },
  }))

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params: { slug } }) {
  const res = await fetch(
    `${API_URL}/api/events/?populate=*&filters[slug][$eq]=${slug}`,
  )
  const events = await res.json()

  return {
    props: {
      evt: events.data[0].attributes,
      id: events.data[0].id,
    },
    revalidate: 1,
  }
}

// export async function getServerSideProps({ query: { slug } }) {
//   const res = await fetch(
//     `${API_URL}/api/events/?populate=*&filters[slug][$eq]=${slug}`,
//   )
//   const events = await res.json()

//   return {
//     props: {
//       evt: events.data[0].attributes,
//       id: events.data[0].id,
//     },
//   }
// }
