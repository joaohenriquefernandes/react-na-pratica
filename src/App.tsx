import { FileDown, Filter, MoreHorizontal, Plus, Search } from 'lucide-react'
import { Header } from './components/Header'
import { Tabs } from './components/Tabs'
import { Button } from './components/ui/Button'
import { Control, Input } from './components/ui/Input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './components/ui/Table'
import { Pagination } from './components/Pagination'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
// import useDebounceValue from './hooks/UseDebounceValue'

export interface ITag {
  title: string
  amountOfVideos: number
  id: string
}
export interface ITagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: ITag[]
}

export function App() {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlFilter = searchParams.get('filter') ?? ''

  const [filter, setFilter] = useState(urlFilter)
  // const debouncedFilter = useDebounceValue(filter, 1000)

  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1

  // useEffect(() => {
  //   setSearchParams((params) => {
  //     params.set('page', '1')

  //     return params
  //   })
  // }, [debouncedFilter])

  const { data: tagsResponse, isLoading } = useQuery<ITagResponse>({
    queryKey: ['get-tags', urlFilter, page],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:3333/tags?_page=${page}&_per_page=10&title=${urlFilter}`,
      )
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  })

  function handleFilter() {
    setSearchParams((params) => {
      params.set('page', '1')
      params.set('filter', filter)

      return params
    })
  }

  if (isLoading) {
    return null
  }

  return (
    <div className="py-10 space-y-8">
      <div>
        <Header />

        <Tabs />
      </div>

      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>

          <Button
            className="inline-flex items-center gap-1.5 text-xs bg-teal-300 text-teal-950 font-medium rounded-full px-2 py-1"
            variant="primary"
          >
            <Plus className="size-3" />
            Create new
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Input variant="filter">
              <Search className="size-3" />

              <Control
                placeholder="Search tags..."
                onChange={(e) => setFilter(e.target.value)}
                value={filter}
              />
            </Input>

            <Button onClick={handleFilter}>
              <Filter className="size-3" />
              Filter
            </Button>
          </div>

          <Button>
            <FileDown className="size-3" />
            Expotar
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Amount of videos</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tagsResponse?.data.map((tag) => {
              return (
                <TableRow key={tag.id}>
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{tag.title}</span>
                      <span className="text-sm text-zinc-500">{tag.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {tag.amountOfVideos} video(s)
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {tagsResponse && (
          <Pagination
            items={tagsResponse?.items}
            page={page}
            pages={tagsResponse.pages}
          />
        )}
      </main>
    </div>
  )
}
