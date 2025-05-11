// pages/_app.js
import { useEffect } from "react"
import Router from "next/router"
import NProgress from "nprogress"
import "nprogress/nprogress.css"
import "../styles/globals.css"
import Layout from "../components/Layout"

NProgress.configure({ showSpinner: false, trickleSpeed: 100 })

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const start = () => NProgress.start()
    const done = () => NProgress.done()

    Router.events.on("routeChangeStart", start)
    Router.events.on("routeChangeComplete", done)
    Router.events.on("routeChangeError", done)

    return () => {
      Router.events.off("routeChangeStart", start)
      Router.events.off("routeChangeComplete", done)
      Router.events.off("routeChangeError", done)
    }
  }, [])

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
