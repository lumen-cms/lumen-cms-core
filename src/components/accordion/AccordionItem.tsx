import React, { useState } from 'react'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Accordion from '@material-ui/core/Accordion'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import Plus from 'mdi-material-ui/Plus'
import { LmComponentRender } from '@LmComponentRender'
import { LmAccordionItemProps } from './accordionTypes'

export default function LmAccordionItem({
  content,
  options,
  setOpen,
  opened,
  iteration
}: LmAccordionItemProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<string>('')
  const panelKey = `panel-${iteration}`
  const expanded = options.restrict_one
    ? opened === panelKey
    : isOpen === panelKey
  const titleCustom = content.title_custom || []
  return (
    <Accordion
      square={!!options.square}
      expanded={expanded}
      onChange={(_, isExpanded) => {
        options.restrict_one
          ? setOpen(isExpanded ? panelKey : '')
          : setIsOpen(isExpanded ? panelKey : '')
      }}
    >
      <AccordionSummary
        expandIcon={
          content.use_plus_icon || options.use_plus ? <Plus /> : <ChevronDown />
        }
      >
        {titleCustom.length ? (
          titleCustom.map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))
        ) : (
          <Typography>{content.title}</Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <>
          {(content.body || []).map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))}
        </>
      </AccordionDetails>
    </Accordion>
  )
}
