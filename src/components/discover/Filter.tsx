"use client"

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, X } from "lucide-react"
import SearchInput from '../SearchInput'

const FILTER_OPTIONS = {
    categories: ["Theatre", "Career", "Workshop", "Sports"],
    campuses: ["Gombak", "Kuantan", "Pagoh", "Gambang"],
    additionalFilters: [
        { id: 'fee', label: 'Fee' },
        { id: 'starpoints', label: 'Starpoints' }
    ]
}

function Filter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const getActiveFiltersCount = () => {
        let count = 0
        if (searchParams.get('category')) count++
        if (searchParams.get('campus')) count++
        if (searchParams.get('fee')) count++
        if (searchParams.get('starpoints')) count++
        return count
    }

    const updateSearchParams = (key: string, value: string | boolean) => {
        const params = new URLSearchParams(searchParams.toString())
        value ? params.set(key, value.toString()) : params.delete(key)
        router.replace(`?${params.toString()}`)
    }

    const clearAllFilters = () => {
        router.replace('?')
    }

    const CheckboxFilter = ({
        id,
        label,
        paramKey = id.toLowerCase(),
        getValue = (value: string) => value.toLowerCase()
    }: {
        id: string
        label: string
        paramKey?: string
        getValue?: (value: string) => string
    }) => {
        const isChecked = searchParams.get(paramKey) === getValue(id)

        return (
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 w-full">
                    <Checkbox
                        id={id}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                            updateSearchParams(paramKey, checked ? getValue(id) : false)
                        }
                    />
                    <Label className='cursor-pointer w-full' htmlFor={id}>{label}</Label>
                </div>
                {isChecked && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateSearchParams(paramKey, false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        )
    }

    const FilterSection = ({
        title,
        items,
        paramKey,
        getValue
    }: {
        title: string
        items: string[]
        paramKey?: string
        getValue?: (value: string) => string
    }) => (
        <div className="space-y-4">
            <h3 className="font-medium">{title}</h3>
            {items.map((item) => (
                <CheckboxFilter
                    key={item}
                    id={item}
                    label={item}
                    paramKey={paramKey}
                    getValue={getValue}
                />
            ))}
        </div>
    )

    const FilterContent = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">Filters</h2>
                {getActiveFiltersCount() > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-muted-foreground hover:text-primary"
                    >
                        Clear all
                    </Button>
                )}
            </div>
            <FilterSection
                title="Categories"
                items={FILTER_OPTIONS.categories}
                paramKey="category"
            />
            <FilterSection
                title="Campus"
                items={FILTER_OPTIONS.campuses}
                paramKey="campus"
            />
            <div className="space-y-4">
                <h3 className="font-medium">Additional Filters</h3>
                {FILTER_OPTIONS.additionalFilters.map(({ id, label }) => (
                    <CheckboxFilter
                        key={id}
                        id={id}
                        label={label}
                        getValue={() => 'true'}
                    />
                ))}
            </div>
        </div>
    )

    const activeFilters = getActiveFiltersCount()

    return (
        <>
            {/* Mobile View */}
            <div className="lg:hidden flex gap-2 w-full">
                <div className="flex-1">
                    <SearchInput page='Discover' />
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0 relative">
                            <SlidersHorizontal className="h-4 w-4" />
                            {activeFilters > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                    {activeFilters}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                        <SheetTitle>Filter Events</SheetTitle>
                        <div className="py-6">
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            {/* Desktop View */}
            <div className="hidden lg:block w-full">
                <SearchInput page='Discover' />
                <FilterContent />
            </div>
        </>
    )
}

export default Filter