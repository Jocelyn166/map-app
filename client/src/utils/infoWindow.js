function buildMapsLink(lat, lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

function el(tag, attrs = {}, styles = {}) {
    const node = document.createElement(tag)

    for (const [k, v] of Object.entries(attrs)) {
        if (v == null) continue
        if (k === 'text') node.textContent = v
        else if (k === 'html') node.innerHTML = v
        else if (k === 'className') node.className = v
        else node.setAttribute(k, String(v))
    }

    Object.assign(node.style, styles)

    return node
}

export function buildInfoWindowContent({ lat, lng, address, onSaveLocation }) {
    const container = el(
        'div',
        {
            role: 'dialog',
            'aria-label': 'Selected location details',
        },
        {
            fontFamily: 'Roboto, Arial, sans-serif',
            padding: '12px',
            maxWidth: '280px',
            borderRadius: '10px',
            color: '#202124',
        }
    )

    const addressHeading = el(
        'div',
        {
            role: 'heading',
            'aria-level': '2',
            text: address,
        },
        {
            fontSize: '15px',
            fontWeight: '600',
            lineHeight: '1.35',
            marginBottom: '6px',
        }
    )
    container.appendChild(addressHeading)

    const coordsText = `Latitude ${lat.toFixed(6)}, Longitude ${lng.toFixed(6)}`
    const coords = el(
        'div',
        {
            text: coordsText,
        },
        {
            fontSize: '13px',
            color: '#5f6368',
            marginBottom: '10px',
        }
    )
    container.appendChild(coords)

    const linkWrap = el('div', {}, { marginBottom: '10px' })

    const link = el(
        'a',
        {
            href: buildMapsLink(lat, lng),
            target: '_blank',
            rel: 'noopener noreferrer',
            'aria-label': 'Open this location in Google Maps in a new tab',
            text: 'View on Google Maps',
        },
        {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #d2e3fc',
            background: '#f8fbff',
            color: '#1a73e8',
            fontSize: '14px',
            fontWeight: '500',
            textDecoration: 'none',
            userSelect: 'none',
        }
    )

    const icon = el(
        'span',
        { 'aria-hidden': 'true', text: '↗' },
        { fontSize: '14px', lineHeight: '1' }
    )
    link.appendChild(icon)

    // focus + hover styles for accessibility
    link.addEventListener('mouseenter', () => {
        link.style.background = '#eef5ff'
    })
    link.addEventListener('mouseleave', () => {
        link.style.background = '#f8fbff'
    })
    link.addEventListener('focus', () => {
        link.style.outline = '3px solid #c7d2fe'
        link.style.outlineOffset = '2px'
    })
    link.addEventListener('blur', () => {
        link.style.outline = 'none'
    })

    linkWrap.appendChild(link)
    container.appendChild(linkWrap)

    container.appendChild(
        el('div', { 'aria-hidden': 'true' }, { height: '1px', background: '#e0e0e0', margin: '8px 0' })
    )

    // Live region for screen readers (announces saving/saved/error)
    const live = el(
        'div',
        {
            role: 'status',
            'aria-live': 'polite',
            'aria-atomic': 'true',
        },
        {
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
        }
    )
    container.appendChild(live)

    const saveBtn = el(
        'button',
        {
            type: 'button',
            'aria-label': 'Save this location',
        },
        {
            width: '100%',
            marginTop: '10px',
            padding: '9px 0',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            background: '#1a73e8',
        }
    )

    saveBtn.addEventListener('focus', () => {
        saveBtn.style.outline = '3px solid #c7d2fe'
        saveBtn.style.outlineOffset = '2px'
    })
    saveBtn.addEventListener('blur', () => {
        saveBtn.style.outline = 'none'
    })

    const setState = (state) => {
        if (state === 'idle') {
            saveBtn.disabled = false
            saveBtn.textContent = 'Save Location'
            saveBtn.style.background = '#1a73e8'
            saveBtn.setAttribute('aria-disabled', 'false')
            live.textContent = ''
        } else if (state === 'saving') {
            saveBtn.disabled = true
            saveBtn.textContent = 'Saving…'
            saveBtn.style.background = '#9aa0a6'
            saveBtn.setAttribute('aria-disabled', 'true')
            live.textContent = 'Saving location.'
        } else if (state === 'saved') {
            saveBtn.disabled = true
            saveBtn.textContent = 'Saved ✓'
            saveBtn.style.background = '#34a853'
            saveBtn.setAttribute('aria-disabled', 'true')
            live.textContent = 'Location saved.'
        } else if (state === 'error') {
            saveBtn.disabled = false
            saveBtn.textContent = 'Error — try again'
            saveBtn.style.background = '#d93025'
            saveBtn.setAttribute('aria-disabled', 'false')
            live.textContent = 'Save failed. Please try again.'
        }
    }

    saveBtn.addEventListener('mouseenter', () => {
        if (!saveBtn.disabled && saveBtn.textContent === 'Save Location') {
            saveBtn.style.background = '#1669c1'
        }
    })
    saveBtn.addEventListener('mouseleave', () => {
        if (!saveBtn.disabled && saveBtn.textContent === 'Save Location') {
            saveBtn.style.background = '#1a73e8'
        }
    })

    setState('idle')

    saveBtn.addEventListener('click', async () => {
        if (saveBtn.disabled) return
        setState('saving')

        try {
            await onSaveLocation({ latitude: lat, longitude: lng, fullAddress: address })
            setState('saved')
        } catch (err) {
            console.error('Save failed:', err)
            setState('error')
            setTimeout(() => setState('idle'), 1800)
        }
    })

    saveBtn.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !saveBtn.disabled) {
            e.preventDefault()
            saveBtn.click()
        }
    })

    container.appendChild(saveBtn)

    return container
}
