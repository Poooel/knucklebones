import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { randomName } from '../utils/name'
import { Router } from './Router'
import { getPathLanguage } from '../translations'
import { MainContent, SideBarContainer, SideBarLayout } from './SideBar'
import { Theme } from './Theme'
import { Language } from './Language'

export function App() {
  const mainContentRef = React.useRef<React.ElementRef<'div'>>(null)

  React.useEffect(() => {
    if (localStorage.getItem('playerId') === null) {
      localStorage.setItem('playerId', randomName())
    }
  }, [])

  return (
    <BrowserRouter basename={getPathLanguage()}>
      <div className='bg-slate-50 text-slate-900 transition-colors duration-150 ease-in-out dark:bg-slate-900 dark:text-slate-200'>
        <SideBarLayout>
          <SideBarContainer
            swipeableAreaRef={mainContentRef}
            actions={
              <>
                <Theme />
                <Language />
              </>
            }
          />

          <MainContent ref={mainContentRef}>
            <Router />
          </MainContent>
        </SideBarLayout>
      </div>
    </BrowserRouter>
  )
}
