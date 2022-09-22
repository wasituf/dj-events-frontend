import { DateTime } from 'luxon'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaImage } from 'react-icons/fa'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import ImageUpload from '@/components/ImageUpload'
import { API_URL } from '@/config/index'
import styles from '@/styles/Form.module.css'

export default function EditEventPage({ evt, id }) {
  const [values, setValues] = useState({
    data: {
      name: evt.name,
      performers: evt.performers,
      venue: evt.venue,
      address: evt.address,
      date: evt.date,
      time: evt.time,
      description: evt.description,
    },
  })
  const [imagePreview, setImagePreview] = useState(
    evt.image.data ? evt.image.data.attributes.formats.thumbnail.url : null,
  )
  const [showModal, setShowModal] = useState(false)

  const router = useRouter()

  const handleSubmit = async e => {
    e.preventDefault()

    // Validation
    const hasEmptyFields = Object.values(values.data).some(el => el === '')

    if (hasEmptyFields) {
      toast.error('Please fill in all fields')
    } else {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'PUT',
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

  const imageUploaded = async e => {
    const res = await fetch(`${API_URL}/api/events/${id}?populate=*`)
    const data = await res.json()

    setImagePreview(
      data.data.attributes.image.data.attributes.formats.thumbnail.url,
    )

    setShowModal(false)
  }

  return (
    <Layout title='Add New Event'>
      <a
        href='#'
        onClick={e => {
          e.preventDefault()
          router.back()
        }}
        className={styles.back}
      >
        {'<'} Go Back
      </a>
      <ToastContainer position='top-center' autoClose={3000} hideProgressBar />
      <h1>Edit Event</h1>

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
              value={DateTime.fromISO(values.data.date).toFormat('yyyy-MM-dd')}
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

        <input type='submit' value='Update Event' className='btn' />
      </form>

      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={imagePreview} alt='' height={100} width={170} />
      ) : (
        <div>
          <p>No image uploaded</p>
        </div>
      )}

      <div>
        <button
          className='btn-secondary btn-icon'
          onClick={() => {
            window.scrollTo(0, 0)
            setShowModal(true)
          }}
        >
          <FaImage size={14} /> Set Image
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload evtId={id} imageUploaded={imageUploaded} />
      </Modal>
    </Layout>
  )
}

export async function getServerSideProps({ params: { id }, req }) {
  const res = await fetch(`${API_URL}/api/events/${id}?populate=*`)
  const evt = await res.json()

  return {
    props: {
      evt: evt.data.attributes,
      id,
    },
  }
}
