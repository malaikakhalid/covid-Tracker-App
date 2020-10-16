import React from 'react'
import {Card , CardContent, Typography} from '@material-ui/core';
import './InfoBox.css'

function Infobox({title, cases,total,active,isRed,isPink, ...props}) {
    return (
        <div>
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox__selected'} ${isRed && 'infoBox__red'} ${isPink && 'infoBox__pink'}`}>
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary" >
          {title}
        </Typography>
         
          <h2 className="infoBox__cases">{cases}</h2>
        
         <Typography className="infoBox__total" color="textSecondary" >
          {total} Total
        </Typography>
        
      </CardContent>
    </Card>
            
        </div>
    )
}

export default Infobox
