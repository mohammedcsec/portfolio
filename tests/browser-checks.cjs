async (page) => {
  const results = []
  const check = (condition, label) => {
    if (!condition) throw new Error(label)
    results.push(label)
  }
  const base = 'http://localhost:5173/'
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const width of [320, 375, 390, 430, 768, 1024, 1440, 1600]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(base + '#/')
    await page.getByRole('heading', { level: 1 }).waitFor()
    check(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Home fits ${width}px`,
    )
    await page.goto(base + '#/projects')
    await page.getByRole('textbox', { name: 'Search projects' }).waitFor()
    check(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `Projects fit ${width}px`,
    )
  }
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.getByRole('textbox', { name: 'Search projects' }).fill('HTTP')
  check((await page.locator('.record-card').count()) === 1, 'Project search')
  await page.getByRole('button', { name: 'CTF', exact: true }).click()
  check(await page.getByText('No matching entries').isVisible(), 'Combined filtering empty state')
  await page.getByRole('button', { name: 'Reset filters' }).click()
  check((await page.locator('.record-card').count()) === 3, 'Reset restores collection')
  await page.locator('.record-card a').first().click()
  await page.getByRole('heading', { name: 'Web assessment notebook', exact: true }).waitFor()
  await page.reload()
  await page.getByRole('heading', { name: 'Web assessment notebook', exact: true }).waitFor()
  check(true, 'Detail direct refresh')
  await page.getByRole('link', { name: 'Risk analysis', exact: true }).click()
  await page.waitForFunction(() => { const el=document.getElementById('part-6'); return el && el.getBoundingClientRect().top>=-2 && el.getBoundingClientRect().top<100 && document.activeElement===el })
  check(true, 'Table of contents scroll and focus')
  await page.goto(base + '#/research/reproducible-notes')
  await page.getByRole('button', { name: 'Copy code' }).waitFor()
  check((await page.locator('pre code').count()) === 1, 'Highlighted Markdown code')
  check((await page.locator('.hljs').count()) > 0, 'Syntax highlighter applied')
  for (const route of ['research', 'achievements', 'about', 'contact', 'missing-page']) {
    await page.goto(base + '#/' + route)
    await page.getByRole('heading', { level: 1 }).waitFor()
    check((await page.getByRole('heading', { level: 1 }).count()) === 1, `${route} navigation`)
  }
  check(await page.getByText('No signal here.').isVisible(), 'Custom 404')
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(base)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page
    .getByRole('navigation', { name: 'Main navigation', exact: true })
    .getByRole('link', { name: 'About', exact: true })
    .click()
  check(
    await page.getByRole('heading', { name: 'Hi, I’m Mohammed.' }).isVisible(),
    'Mobile menu navigation',
  )
  check(
    await page.getByRole('button', { name: 'Open navigation' }).isVisible(),
    'Mobile menu closes',
  )
  check((await page.locator('html.lenis').count()) === 0, 'Reduced motion uses native scrolling')
  await page.goto(base + '#/control-center/')
  await page.getByRole('button', { name: 'Projects', exact: true }).click()
  await page.getByRole('button', { name: 'Add record' }).click()
  await page.getByRole('button', { name: 'Save in memory' }).click()
  check(
    await page.getByText('New entry', { exact: true }).isVisible(),
    'Local editor create and save',
  )
  await page.evaluate(() => {
    window.confirm = () => false
  })
  await page.getByRole('button', { name: 'Delete New entry' }).click()
  check(await page.getByText('New entry', { exact: true }).isVisible(), 'Delete cancellation')
  await page.evaluate(() => {
    window.confirm = () => true
  })
  await page.getByRole('button', { name: 'Delete New entry' }).click()
  check(
    (await page.getByText('New entry', { exact: true }).count()) === 0,
    'Explicit delete confirmation',
  )
  await page.getByRole('button', { name: 'Add record' }).click()
  await page.getByText('id', { exact: true }).locator('input').fill('BAD ID')
  await page.getByRole('button', { name: 'Save in memory' }).click()
  check(
    (await page.locator('.admin-message').innerText()).includes('id'),
    'Editor schema validation',
  )
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export site.json' }).click()
  check((await download).suggestedFilename() === 'site.json', 'Content export download')
  await page.setViewportSize({ width: 320, height: 812 })
  check(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'Admin fits 320px',
  )
  await page.getByRole('button', {name:'Cancel',exact:true}).click()
  return { passed: results.length, results }
}
