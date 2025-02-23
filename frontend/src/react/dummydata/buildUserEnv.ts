const usernameToIdMap: any = {
  sulwaaan: '5U11W44N',
  concernedSquirrel: '2lswagasdlkgj',
  buttstuff6969: '3rihdlbnkx',
  berry: 'wmqbenfs23r',
  jenks: 'zodiby8oilhawf',
  glitch: '283uisalkdjg',
  seclusion: '23ijeknwesg'
}

const buildUserEnv = (username: string) => {
  const thisUserId = usernameToIdMap[username]

  return {
    thisUserId,
  }

}

export default buildUserEnv