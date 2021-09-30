import axios from "axios";

const rest = axios.create({
    baseURL: 'https://statsapi.web.nhl.com/api/v1',
    headers: {}
})

export namespace NhlApi {

    export type Team = {
        id : number
        name : string
        link : string
        venue : {
          name : string
          link : string
          city : string
          timeZone : {
            id : string
            offset : number
            tz : string
          }
        },
        abbreviation : string
        teamName : string
        locationName : string
        firstYearOfPlay : string
        division : {
          id : number
          name : string
          nameShort: string
          link : string
          abbreviation : string
        },
        conference : {
          id : number
          name : string
          link : string
        },
        franchise : {
          franchiseId : number
          teamName : string
          link : string
        },
        shortName : string
        officialSiteUrl : string
        franchiseId : number
        active : boolean    
    }

    export type TeamsResponse = {
        copyright: string
        teams: Team[]
    }


    export const api = {
        getTeams: () : Promise<TeamsResponse> => {
            return rest.get('/teams').then(response => response.data)
        },

    }



}

