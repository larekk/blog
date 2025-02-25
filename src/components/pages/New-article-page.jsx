import LoggedInHeader from '../logged-in-header/Logged-in-header'
import { NewArticle } from '../new-article/New-article'

export default function NewArticlePage() {
  return (
    <>
      <LoggedInHeader />
      <NewArticle></NewArticle>
    </>
  )
}
