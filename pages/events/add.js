import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '@/components/Layout'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'

export default function AddEventPage() {
  const [values, setValues] = useState({
    data: {
      name: '',
      performers: '',
      venue: '',
      address: '',
      date: '',
      time: '',
      description: '',
    },
  })

  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()

    // Validation
    const hasEmptyFields = Object.values(values.data).some(el => el === '')

    if (hasEmptyFields) {
      toast.error('Please fill in all fields')
    } else {
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        toast.error('Something went wrong')
      } else {
        const evt = await res.json()
        router.push(`/events/${evt.data.attributes.slug}`)
      }
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setValues({ data: { ...values.data, [name]: value } })
  }

  return (
    <Layout title='Add New Event'>
      <Link href='/events'>
        <a>{'<'} Go Back</a>
      </Link>

      <ToastContainer position='top-center' autoClose={3000} hideProgressBar />

      <h1>Add Event</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.grid}>
          <div>
            <label htmlFor='name'>Event Name</label>
            <input
              type='text'
              id='name'
              name='name'
              value={values.data.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='performers'>Performers</label>
            <input
              type='text'
              name='performers'
              id='performers'
              value={values.data.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='venue'>Venue</label>
            <input
              type='text'
              name='venue'
              id='venue'
              value={values.data.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='address'>Address</label>
            <input
              type='text'
              name='address'
              id='address'
              value={values.data.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='date'>Date</label>
            <input
              type='date'
              name='date'
              id='date'
              value={values.data.date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor='time'>Time</label>
            <input
              type='text'
              name='time'
              id='time'
              value={values.data.time}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor='description'>Event Description</label>
          <textarea
            type='text'
            name='description'
            id='description'
            value={values.data.description}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <input type='submit' value='Add Event' className='btn' />
      </form>
    </Layout>
  )
}
