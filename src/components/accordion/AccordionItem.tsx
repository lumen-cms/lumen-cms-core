import React, { useState } from 'react'
import { AccordionItemStoryblok, AccordionStoryblok } from '../../typings/generated/components-schema'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ChevronDown from 'mdi-material-ui/ChevronDown'
import Plus from 'mdi-material-ui/Plus'
import { useAppContext } from '../provider/AppProvider'

type LmAccordionItemProps = {
  content: AccordionItemStoryblok,
  options: AccordionStoryblok,
  opened: string,
  setOpen: Function,
  iteration: number
}

export function LmAccordionItem({ content, options, setOpen, opened, iteration }: LmAccordionItemProps): JSX.Element {
  const [isOpen, setIsOpen] = useState<string>('')
  const { ComponentRender } = useAppContext()

  const handleChange = (panel: string) => (_: React.ChangeEvent<{}>, isExpanded: boolean) => {
    options.restrict_one ? setOpen(isExpanded ? panel : '') : setIsOpen(isExpanded ? panel : '')
  }
  const panelKey = `panel-${iteration}`
  const expanded = options.restrict_one ? opened === panelKey : isOpen === panelKey
  return (
    <ExpansionPanel square={options.square ? true : false}
                    expanded={expanded}
                    onChange={handleChange(panelKey)}>
      <ExpansionPanelSummary expandIcon={(content.use_plus_icon || options.use_plus) ? <Plus /> : <ChevronDown />}>
        <Typography>{content.title}</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div>
          {(content.body || []).map((blok, i) => ComponentRender({ content: blok, i }))}
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}
