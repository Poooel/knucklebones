import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { getPathLanguage } from '../translations'
import { randomName } from '../utils/name'
import { Language } from './Language'
import { Router } from './Router'
import { MainContent, SideBarContainer, SideBarLayout } from './SideBar'
import { Theme } from './Theme'

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
