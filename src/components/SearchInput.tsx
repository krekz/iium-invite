"use client"

import React, { useState, FormEvent, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Search } from 'lucide-react'

const searchSuggestions = [
    "Theatre",
    "Career",
    "Workshop",
    "Sports",
]

type SearchInputProps = {
    page: "Home" | "Discover"
}

function SearchInput({ page }: SearchInputProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

    useEffect(() => {
        setSearchQuery(searchParams.get("q") || "")
    }, [searchParams])

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (page === "Home") {
            router.push(`/discover?q=${searchQuery}`)
        } else {
            const params = new URLSearchParams(searchParams.toString())
            if (searchQuery) {
                params.set("q", searchQuery)
            } else {
                params.delete("q")
            }
            router.replace(`?${params.toString()}`)
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        router.push(`/discover?q=${suggestion}`)
    }

    const renderSearchForm = () => {
        switch (page) {
            case "Home":
                return (
                    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
                        <div className="relative flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Iftar Jamaie"
                                    className="h-10 text-lg bg-background/60 backdrop-blur-sm border-muted"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="bg-primary/80 hover:bg-primary transition-colors">
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {searchSuggestions.map((suggestion) => (
                                <Button
                                    type="button"
                                    key={suggestion}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full hover:bg-primary/20 transition-colors"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </div>
                    </form>
                );
            case "Discover":
                return (
                    <form onSubmit={handleSubmit} className="w-full max-w-md mb-4">
                        <div className="relative flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Search events..."
                                    className="h-9 bg-background/60 backdrop-blur-sm border-muted"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Button type="submit" size="sm" className="bg-primary/80 hover:bg-primary rounded-full transition-colors">
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                );
            default:
                return null;
        }
    }

    return renderSearchForm();
}

export default SearchInput