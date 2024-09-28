            const isRelevant = jobTitlesArray.some(title => vacancy.title.toLowerCase().includes(title.toLowerCase()));
            const hasOfficeTerms = /офис\b|гибрид\b/.test(vacancy.description.toLowerCase());
            const hasRemoteTerms = /удален\b|удалён\b|дистанционн\b/.test(vacancy.description.toLowerCase());

            if (!isRelevant) {
                skippedDueToTitle++;
                addSkippedVacancy(vacancy);
                continue;
            }

            if (hasOfficeTerms && !hasRemoteTerms) {
                skippedDueToTerms++;
                addSkippedVacancy(vacancy);
                continue;
            }