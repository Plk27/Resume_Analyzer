from backend.app.main import build_analysis_result


def test_build_analysis_result_extracts_skills_and_keywords():
    resume = """
    Experienced Python developer with SQL, pandas, and machine learning experience.
    Built a FastAPI service and deployed it on AWS.
    """
    jd = """
    Senior Python engineer with Docker, Kubernetes, AWS, and machine learning experience.
    """

    result = build_analysis_result(resume, jd)

    assert result['atsScore'] >= 60
    assert 'Python' in result['matchedSkills']
    assert 'AWS' in result['matchedSkills']
    assert 'Docker' in result['missingSkills']
    assert 'Kubernetes' in result['missingSkills']
    assert 'Docker' in result['keywordsMissing']
