import React from 'react'
import styles from '../styles'
const regex=/^[A-Za-z0-9]+$/;
const CustomInputs = ({label, placeholder, value, handleValueChange}) => {
  return (
    <div className='w-full '>
      <label htmlFor='name' className={styles.label}>{label}</label><br/>
      <input type="text" placeholder={placeholder} value={value} className={styles.input} onChange={(e)=>{if(e.target.value==='' || regex.test(e.target.value)) handleValueChange(e.target.value)}} />
    </div>
  )
}

export default CustomInputs