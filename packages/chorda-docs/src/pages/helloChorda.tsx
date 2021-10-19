import React from 'react';
import Layout from '@theme/Layout';
import { buildHtmlContext, buildHtmlOptions, Html } from "../../../chorda-core/src";
import { createReactRenderer } from "../../../chorda-react/src";


const options = buildHtmlOptions({})

const context = buildHtmlContext(
  createReactRenderer() 
)


const html = new Html(options, context)


const ChordaComponent = () => {
  
  const ref = (el: HTMLElement) => {
    if (el) {
        context.$renderer.attach(el, html)
    }
    else {
        context.$renderer.detach(html)
    }
  }

  return <div ref={ref}/>
}


function Hello() {
  return (
    <ChordaComponent></ChordaComponent>
    // <Layout title="Hello">
    //   <div
    //     style={{
    //       display: 'flex',
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //       height: '50vh',
    //       fontSize: '20px',
    //     }}>
    //     <p>
    //       Edit <code>pages/hello.js</code> and save to reload.
    //     </p>
    //     <ChordaComponent></ChordaComponent>
    //   </div>
    // </Layout>
  );
}

export default Hello;