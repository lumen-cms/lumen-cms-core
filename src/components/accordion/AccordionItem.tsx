import React, { useState } from 'react'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Accordion from '@material-ui/core/Accordion'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import Plus from 'mdi-material-ui/Plus'
import { LmComponentRender } from '../CoreComponents'
import { LmAccordionItemProps } from './accordionTypes'

export function LmAccordionItem({
  content,
  options,
  setOpen,
  opened,
  iteration
}: LmAccordionItemProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<string>('')

  const handleChange = (panel: string) => (
    _: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    options.restrict_one
      ? setOpen(isExpanded ? panel : '')
      : setIsOpen(isExpanded ? panel : '')
  }
  const panelKey = `panel-${iteration}`
  const expanded = options.restrict_one
    ? opened === panelKey
    : isOpen === panelKey
  return (
    <Accordion
      square={!!options.square}
      expanded={expanded}
      onChange={handleChange(panelKey)}
    >
      <AccordionSummary
        expandIcon={
          content.use_plus_icon || options.use_plus ? <Plus /> : <ChevronDown />
        }
      >
        <Typography>{content.title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          {(content.body || []).map((blok, i) =>
            LmComponentRender({ content: blok, i })
          )}
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
