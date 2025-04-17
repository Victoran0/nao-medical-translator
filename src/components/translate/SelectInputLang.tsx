"use client"
import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTranslatorStore } from "../../app/providers/translator-store-provider";

const SelectInputLang = () => {
    const {inputLang, manageLang} = useTranslatorStore((state) => state,);

    return (
        <Select
            onValueChange={(value) => {
                manageLang('inputLang', value)
            }}
            defaultValue={inputLang}
        >
        <SelectTrigger className="text-center w-32 bdBox font-[600] max-[700px]:w-28 text-[12px] cursor-pointer">
            <SelectValue placeholder="Input Lang" />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
            <SelectLabel>Input Language</SelectLabel>
            <SelectItem value="en-US">English</SelectItem>
            <SelectItem value="fr-FR">French</SelectItem>
            <SelectItem value="es-ES">Spanish</SelectItem>
            <SelectItem value="de-DE">German</SelectItem>
            <SelectItem value="it-IT">Italian</SelectItem>
            <SelectItem value="pt-PT">Portuguese</SelectItem>
            </SelectGroup>
        </SelectContent>
        </Select>
    )
};

export default SelectInputLang;