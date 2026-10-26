import { useState } from 'react'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import AccordionDetails from '@mui/material/AccordionDetails'
import Accordion from '@mui/material/Accordion'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import Plus from 'mdi-material-ui/Plus'
import { LmComponentRender } from '@LmComponentRender'
import { LmAccordionItemProps } from './accordionTypes'

export default function LmAccordionItem({
  content,
  options,
  setOpen,
  opened,
  iteration,
  classes
}: LmAccordionItemProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<string>('')
  const panelKey = `panel-${iteration}`
  const expanded = options.restrict_one
    ? opened === panelKey
    : isOpen === panelKey
  const titleCustom = content.title_custom || []
  return (
    <Accordion
      // Custom CMS titles can contain headings and interactive images. Keep
      // their legacy containers to avoid nested headings/buttons in SSR HTML.
      slots={titleCustom.length ? { heading: 'div' } : undefined}
      variant={options.variant || 'elevation'}
      square={!!options.square}
      expanded={expanded}
      onChange={(_, isExpanded) => {
        options.restrict_one
          ? setOpen(isExpanded ? panelKey : '')
          : setIsOpen(isExpanded ? panelKey : '')
      }}
      classes={{
        root: classes.advanced
      }}
    >
      <AccordionSummary
        component={titleCustom.length ? 'div' : 'button'}
        slotProps={
          titleCustom.length ? { content: { component: 'div' } } : undefined
        }
        sx={{
          color: 'inherit',
          '& .MuiAccordionSummary-expandIconWrapper': {
            color: 'inherit'
          }
        }}
        expandIcon={
          content.use_plus_icon || options.use_plus ? <Plus /> : <ChevronDown />
        }
      >
        {titleCustom.length ? (
          titleCustom.map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))
        ) : (
          <Typography component="span">{content.title}</Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
        <div className="w-100">
          {(content.body || []).map((blok) => (
            <LmComponentRender content={blok} key={blok._uid} />
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
