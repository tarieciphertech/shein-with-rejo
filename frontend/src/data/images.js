/** Central image registry — original Rejo photography only. */
export const asset = (name) => `${import.meta.env.BASE_URL}${name}`

export const images = {
  rejo: [
    { src: asset('rejo.jpeg'), alt: 'Rejo, the shopper behind SHEIN with Rejo', focal: '50% 50%', caption: 'Rejo, your shopper.' },
    { src: asset('rejo2.jpg'), alt: 'Rejo, the shopper behind SHEIN with Rejo', focal: '50% 50%', caption: 'Personal service in Harare.' },
    { src: asset('rejo3.jpg'), alt: 'Rejo, the shopper behind SHEIN with Rejo', focal: '50% 50%', caption: 'Real help for your SHEIN order.' },
  ],
}
