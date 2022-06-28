import React from 'react'
import { SmileOutlined } from '@ant-design/icons';

function Footer() {
  return (
      <div style={{
          height: '80px', display: 'flex',
          flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', fontSize:'1rem'
      }}>
         <p> youtube 클론코딩입니다. made_by_taeyoon <SmileOutlined/></p>
      </div>
  )
}

export default Footer