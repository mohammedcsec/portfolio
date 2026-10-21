async (page) => {
  const results = []
  const check = (v, label) => {
    if (!v) throw Error(label)
    results.push(label)
  }
  await page.goto('http://localhost:4174/security-lab/#/projects/web-assessment-notebook')
  await page.getByRole('heading', { name: 'Web assessment notebook', exact: true }).waitFor()
  await page.reload()
  await page.getByRole('heading', { name: 'Web assessment notebook', exact: true }).waitFor()
  check(true, 'Subpath detail navigation and refresh')
  check(
    (await page.locator('link[rel=icon]').getAttribute('href')) ===
      '/security-lab/icons/favicon.svg',
    'Subpath favicon',
  )
  await page.goto('http://localhost:4174/security-lab/#/control-center/')
  await page.getByRole('heading', { name: 'Editing stays local.' }).waitFor()
  check(
    (await page.getByRole('button', { name: 'Export site.json' }).count()) === 0,
    'Production editor excluded',
  )
  await page.goto('http://localhost:4174/security-lab/#/research/unpublished-educational-outline')
  await page.getByRole('heading', { name: 'No signal here.' }).waitFor()
  check(true, 'Draft URL returns branded 404')
  return results
}
